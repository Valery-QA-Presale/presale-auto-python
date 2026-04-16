import { retry, waitForCondition } from './retry-utils';

/**
 * Интерфейс подключения к БД
 */
export interface DbConnection {
  query: (sql: string, params?: any[]) => Promise<{ rows: any[] }>;
}

/**
 * Условие для запроса к БД
 */
export interface DbCondition {
  field: string;
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'IS NULL' | 'IS NOT NULL';
  value?: any;
}

/**
 * Безопасное экранирование имени таблицы/колонки
 */
function sanitizeIdentifier(identifier: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new Error(`Invalid identifier: ${identifier}`);
  }
  return `"${identifier}"`;
}

/**
 * Безопасное создание WHERE условия
 */
function buildWhereClause(conditions: Record<string, any> | DbCondition[], startParamIndex = 1): { whereClause: string; params: any[] } {
  const params: any[] = [];
  let paramIndex = startParamIndex;

  if (Array.isArray(conditions)) {
    // Для DbCondition[]
    const clauses = conditions.map((cond) => {
      const field = sanitizeIdentifier(cond.field);

      if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
        return `${field} ${cond.operator}`;
      }

      if (cond.operator === 'IN' && Array.isArray(cond.value)) {
        const placeholders = cond.value.map(() => `$${paramIndex++}`).join(', ');
        params.push(...cond.value);
        return `${field} IN (${placeholders})`;
      }

      const operator = cond.operator || '=';
      params.push(cond.value);
      return `${field} ${operator} $${paramIndex++}`;
    });

    return {
      whereClause: clauses.join(' AND '),
      params,
    };
  } else {
    // Для Record<string, any>
    const clauses = Object.entries(conditions).map(([key, value]) => {
      const field = sanitizeIdentifier(key);

      if (value === null) {
        return `${field} IS NULL`;
      }

      params.push(value);
      return `${field} = $${paramIndex++}`;
    });

    return {
      whereClause: clauses.join(' AND '),
      params,
    };
  }
}

/**
 * Ретрай для операций с БД с обработкой специфичных ошибок
 */
export async function retryDbOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    timeout?: number;
    operationName?: string;
  } = {},
): Promise<T> {
  const { maxAttempts = 5, delay = 2000, timeout = 45000, operationName = 'Database operation' } = options;

  return retry(operation, {
    maxAttempts,
    delay,
    timeout,
    shouldRetry: (error) => {
      const errorStr = error.toString().toLowerCase();

      // Ретраим только специфичные ошибки БД (соединение, таймауты)
      const dbRetryableErrors = [
        'connection',
        'connect econnrefused',
        'connect etimedout',
        'timeout',
        'econnrefused',
        'etimedout',
        'getaddrinfo',
        'pool',
        'socket',
        'read econnreset',
        'query failed',
        'database system is starting up',
        'the database system is starting up',
        'no response from server',
        'terminating connection',
        'could not connect to server',
        'connection terminated',
      ];

      const isDbError = dbRetryableErrors.some((keyword) => errorStr.includes(keyword));

      // НЕ ретраим логические ошибки SQL
      const nonRetryableErrors = ['syntax error', 'duplicate key', 'unique constraint', 'foreign key constraint', 'permission denied', 'does not exist', 'invalid input syntax'];

      const isNonRetryable = nonRetryableErrors.some((keyword) => errorStr.includes(keyword));

      return isDbError && !isNonRetryable;
    },
    onRetry: (attempt, error, waitTime) => {
      console.log(`🔄 DB ${operationName} attempt ${attempt} failed:`, error.message, `Retrying in ${waitTime}ms...`);
    },
    onSuccess: (attempt, result, elapsed) => {
      console.log(`✅ DB ${operationName} succeeded on attempt ${attempt} (${elapsed}ms)`);
    },
  });
}

/**
 * Ожидание появления записи в таблице
 */
export async function waitForDbRecord<T>(
  db: DbConnection,
  table: string,
  conditions: Record<string, any> | DbCondition[],
  options: {
    timeout?: number;
    interval?: number;
    description?: string;
    selectFields?: string;
    orderBy?: string;
  } = {},
): Promise<T> {
  const { timeout = 15000, interval = 1000, description = 'database record', selectFields = '*', orderBy = 'created_at DESC' } = options;

  // Безопасное создание запроса
  const sanitizedTable = sanitizeIdentifier(table);
  const { whereClause, params } = buildWhereClause(conditions);

  const queryText = `SELECT ${selectFields} FROM ${sanitizedTable} WHERE ${whereClause} ORDER BY ${orderBy} LIMIT 1`;

  return waitForCondition(
    async () => {
      try {
        const result = await retryDbOperation(() => db.query(queryText, params), { operationName: `SELECT FROM ${table}` });
        return result.rows.length > 0;
      } catch (error: any) {
        // Игнорируем ошибки соединения, продолжаем поллинг
        console.log(`⚠️ DB query for ${description} failed, will retry:`, error.message);
        return false;
      }
    },
    {
      timeout,
      interval,
      message: `${description} not found in table ${table} with conditions`,
      onPoll: (attempt, elapsed) => {
        console.log(`⏳ Waiting for ${description}, attempt ${attempt} (${elapsed}ms elapsed)`);
      },
    },
  ).then(async () => {
    const result = await retryDbOperation(() => db.query(queryText, params), { operationName: `SELECT FROM ${table} (final)` });

    if (result.rows.length === 0) {
      throw new Error(`${description} disappeared after being found`);
    }

    return result.rows[0] as T;
  });
}

/**
 * Ожидание обновления записи в таблице
 */
export async function waitForDbUpdate<T>(
  db: DbConnection,
  table: string,
  id: string | number,
  idColumn: string = 'id',
  expectedValues: Record<string, any>,
  options: {
    timeout?: number;
    interval?: number;
  } = {},
): Promise<T> {
  const { timeout = 10000, interval = 1000 } = options;

  // БЕЗОПАСНОЕ создание условий
  // @ts-ignore
  const conditions: DbCondition[] = [
    { field: idColumn, operator: '=', value: id },
    // @ts-ignore
    ...Object.entries(expectedValues).map(([field, value]) => ({
      field,
      operator: value === null ? 'IS NULL' : '=',
      value: value === null ? undefined : value,
    })),
  ];

  const { whereClause, params } = buildWhereClause(conditions);
  const sanitizedTable = sanitizeIdentifier(table);
  const queryText = `SELECT * FROM ${sanitizedTable} WHERE ${whereClause}`;

  return waitForCondition(
    async () => {
      try {
        const result = await retryDbOperation(() => db.query(queryText, params), { operationName: `SELECT UPDATE FROM ${table}` });
        return result.rows.length > 0;
      } catch (error: any) {
        console.log(`⚠️ DB update check failed:`, error.message);
        return false;
      }
    },
    {
      timeout,
      interval,
      message: `Record ${idColumn}=${id} in table ${table} not updated to expected values`,
    },
  ).then(async () => {
    const result = await retryDbOperation(() => db.query(queryText, params), { operationName: `SELECT FINAL FROM ${table}` });
    return result.rows[0] as T;
  });
}

/**
 * Ожидание JOIN-запроса (проверка связей между таблицами)
 */
export async function waitForDbJoin<T>(
  db: DbConnection,
  mainTable: string,
  joinTable: string,
  joinCondition: string,
  mainId: string | number,
  mainIdColumn: string = 'id',
  options: {
    timeout?: number;
    interval?: number;
    additionalConditions?: string | DbCondition[];
    selectFields?: string;
  } = {},
): Promise<T> {
  const { timeout = 15000, interval = 1000, additionalConditions = '', selectFields = `${mainTable}.*, ${joinTable}.*` } = options;

  // Безопасные имена таблиц
  const sanitizedMainTable = sanitizeIdentifier(mainTable);
  const sanitizedJoinTable = sanitizeIdentifier(joinTable);
  const sanitizedIdColumn = sanitizeIdentifier(mainIdColumn);

  let whereClause = `WHERE ${sanitizedMainTable}.${sanitizedIdColumn} = $1`;
  const params: any[] = [mainId];

  // Обработка дополнительных условий
  if (additionalConditions) {
    if (typeof additionalConditions === 'string') {
      // Простая строка (должна быть уже безопасной)
      whereClause += ` AND ${additionalConditions}`;
    } else if (Array.isArray(additionalConditions)) {
      // DbCondition[]
      const { whereClause: extraWhere, params: extraParams } = buildWhereClause(additionalConditions, 2); // start from $2

      whereClause += ` AND ${extraWhere}`;
      params.push(...extraParams);
    }
  }

  const queryText = `
    SELECT ${selectFields}
    FROM ${sanitizedMainTable}
    JOIN ${sanitizedJoinTable} ON ${joinCondition}
    ${whereClause}
    LIMIT 1
  `;

  return waitForCondition(
    async () => {
      try {
        const result = await retryDbOperation(() => db.query(queryText, params), { operationName: `JOIN ${mainTable} WITH ${joinTable}` });
        return result.rows.length > 0;
      } catch (error: any) {
        console.log(`⚠️ DB join query failed:`, error.message);
        return false;
      }
    },
    {
      timeout,
      interval,
      message: `Join record not found for ${mainTable}.${mainIdColumn}=${mainId}`,
    },
  ).then(async () => {
    const result = await retryDbOperation(() => db.query(queryText, params), { operationName: `JOIN FINAL ${mainTable} WITH ${joinTable}` });
    return result.rows[0] as T;
  });
}

/**
 * Проверка что запись удалена из БД
 */
export async function waitForDbDeletion(
  db: DbConnection,
  table: string,
  id: string | number,
  idColumn: string = 'id',
  options: {
    timeout?: number;
    interval?: number;
  } = {},
): Promise<void> {
  const { timeout = 10000, interval = 1000 } = options;

  const sanitizedTable = sanitizeIdentifier(table);
  const sanitizedIdColumn = sanitizeIdentifier(idColumn);
  const queryText = `SELECT 1 FROM ${sanitizedTable} WHERE ${sanitizedIdColumn} = $1`;

  return waitForCondition(
    async () => {
      try {
        const result = await retryDbOperation(() => db.query(queryText, [id]), { operationName: `CHECK DELETE FROM ${table}` });
        return result.rows.length === 0; // Запись должна отсутствовать
      } catch (error: any) {
        console.log(`⚠️ DB deletion check failed:`, error.message);
        return false;
      }
    },
    {
      timeout,
      interval,
      message: `Record ${idColumn}=${id} still exists in table ${table}`,
    },
  );
}

/**
 * Транзакционные операции
 */
export async function withTransaction<T>(
  db: DbConnection,
  operation: () => Promise<T>,
  options: {
    isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';
    operationName?: string;
  } = {},
): Promise<T> {
  const { isolationLevel = 'READ COMMITTED', operationName = 'transaction' } = options;

  return retryDbOperation(
    async () => {
      // Начинаем транзакцию
      await db.query('BEGIN');
      await db.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);

      try {
        const result = await operation();
        await db.query('COMMIT');
        return result;
      } catch (error: any) {
        await db.query('ROLLBACK');
        throw error;
      }
    },
    { operationName: `TRANSACTION: ${operationName}` },
  );
}

/**
 * Управление тестовыми данными
 */
export const TestDataManager = {
  /**
   * Создание тестовой записи
   */
  async createTestRecord<T>(
    db: DbConnection,
    table: string,
    data: Record<string, any>,
    options: {
      returning?: string;
      conflict?: string;
      maxAttempts?: number;
      testMarker?: string; // Метка для очистки
    } = {},
  ): Promise<T & { _testMarker?: string }> {
    const { returning = '*', conflict = '', maxAttempts = 3, testMarker = `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` } = options;

    // Добавляем метку для очистки
    const dataWithMarker = { ...data, _test_marker: testMarker };

    const columns = Object.keys(dataWithMarker)
      .map((key) => sanitizeIdentifier(key))
      .join(', ');
    const values = Object.keys(dataWithMarker)
      .map((_, i) => `$${i + 1}`)
      .join(', ');
    const params = Object.values(dataWithMarker);

    let conflictClause = '';
    if (conflict) {
      conflictClause = ` ON CONFLICT ${conflict} DO NOTHING`;
    }

    const queryText = `
      INSERT INTO ${sanitizeIdentifier(table)} (${columns})
      VALUES (${values})
      ${conflictClause}
      RETURNING ${returning}
    `;

    const result = await retryDbOperation(
      async () => {
        const queryResult = await db.query(queryText, params);
        if (queryResult.rows.length === 0) {
          throw new Error(`No rows returned from INSERT into ${table}`);
        }
        return queryResult.rows[0];
      },
      {
        maxAttempts,
        operationName: `INSERT INTO ${table}`,
      },
    );

    return { ...result, _testMarker: testMarker } as any;
  },

  /**
   * Очистка тестовых данных по метке
   */
  async cleanupTestData(db: DbConnection, table: string, testMarker: string): Promise<void> {
    await retryDbOperation(
      async () => {
        await db.query(`DELETE FROM ${sanitizeIdentifier(table)} WHERE _test_marker = $1`, [testMarker]);
      },
      { operationName: `CLEANUP ${table}` },
    );
  },

  /**
   * Очистка всех тестовых данных старше N часов
   */
  async cleanupOldTestData(db: DbConnection, table: string, olderThanHours: number = 24): Promise<number> {
    const result = await retryDbOperation(
      async () => {
        const queryResult = await db.query(
          `DELETE FROM ${sanitizeIdentifier(table)} 
           WHERE _test_marker IS NOT NULL 
           AND created_at < NOW() - INTERVAL '${olderThanHours} hours'
           RETURNING _test_marker`,
          [],
        );
        return queryResult.rows.length;
      },
      { operationName: `CLEANUP OLD ${table}` },
    );

    console.log(`🧹 Cleaned up ${result} old test records from ${table}`);
    return result;
  },
};

/**
 * Помощник для твоих специфичных таблиц (B2B регистрация)
 */
export const B2BRegistrationDbUtils = {
  /**
   * Ожидание заявки (application) в БД
   */
  async waitForApplication(
    db: DbConnection,
    registrationId: string,
    options: {
      timeout?: number;
      interval?: number;
      requireAccountId?: boolean;
    } = {},
  ) {
    const { requireAccountId = true, timeout = 15000, interval = 1000 } = options;

    const record = await waitForDbRecord(
      db,
      'applications',
      { registrationId },
      {
        description: `Заявка ${registrationId}`,
        timeout,
        interval,
      },
    );

    // @ts-ignore
    if (requireAccountId && !record.accountId) {
      // Ждём пока проставится accountId
      await waitForDbUpdate(db, 'applications', registrationId, 'registrationId', { accountId: { $ne: null } }, { timeout: 10000 });

      // Получаем обновлённую запись
      const updated = await retryDbOperation(() => db.query('SELECT * FROM applications WHERE "registrationId" = $1', [registrationId]), { operationName: 'GET UPDATED APPLICATION' });

      return updated.rows[0];
    }

    return record;
  },

  /**
   * Ожидание аккаунта (account) в БД
   */
  async waitForAccount(
    db: DbConnection,
    accountId: string,
    options: {
      timeout?: number;
      interval?: number;
    } = {},
  ) {
    return waitForDbRecord(
      db,
      'accounts',
      { accountId },
      {
        description: `Аккаунт ${accountId}`,
        ...options,
      },
    );
  },

  /**
   * Ожидание связи заявка → аккаунт
   */
  async waitForApplicationAccountLink(
    db: DbConnection,
    registrationId: string,
    userId: string,
    options: {
      timeout?: number;
      interval?: number;
    } = {},
  ) {
    return waitForDbJoin(db, 'applications', 'accounts', 'applications."accountId" = accounts."accountId"', registrationId, 'registrationId', {
      additionalConditions: [{ field: 'ownerId', operator: '=', value: userId }],
      selectFields: 'applications.*, accounts."ownerId", accounts."phoneNumber"',
      ...options,
    });
  },

  /**
   * Быстрая проверка доступности БД
   */
  async checkDbHealth(db: DbConnection): Promise<boolean> {
    try {
      const result = await retryDbOperation(() => db.query('SELECT 1 as health_check'), { maxAttempts: 2, operationName: 'HEALTH CHECK' });
      return result.rows.length > 0;
    } catch {
      return false;
    }
  },
};
