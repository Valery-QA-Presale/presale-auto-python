/**
 * Конфигурация ретраев для API операций
 */
export const API_RETRY_CONFIG = {
  maxAttempts: 3, // 3 попытки
  delay: 1000, // Начинаем с 1 секунды
  backoff: 2, // Экспоненциальный рост (1s, 2s, 4s)
  timeout: 30000, // Общий таймаут 30 секунд
} as const;

/**
 * Конфигурация ретраев для операций с БД
 */
export const DATABASE_RETRY_CONFIG = {
  maxAttempts: 5, // 5 попыток для БД (часто медленнее)
  delay: 2000, // Начинаем с 2 секунд
  backoff: 1.5, // Более плавный рост (2s, 3s, 4.5s)
  timeout: 45000, // 45 секунд для БД
} as const;

/**
 * Конфигурация ретраев для UI тестов (Playwright)
 */
export const UI_RETRY_CONFIG = {
  maxAttempts: 2, // 2 попытки для UI (быстро падаем если что-то не так)
  delay: 2000, // 2 секунды между попытками
  backoff: 2, // Экспоненциальный рост
  timeout: 15000, // 15 секунд для UI операций
} as const;

/**
 * Конфигурация ретраев для SSH операций
 */
export const SSH_RETRY_CONFIG = {
  maxAttempts: 3, // 3 попытки для SSH
  delay: 3000, // 3 секунды между попытками
  backoff: 2, // Экспоненциальный рост
  timeout: 60000, // 60 секунд для SSH (может быть долго)
} as const;

/**
 * Ошибки для ретрая (сгруппированные по типам)
 */
export const RETRYABLE_ERRORS = {
  DATABASE: ['connection', 'timeout', 'ECONNREFUSED', 'ETIMEDOUT', 'getaddrinfo', 'pool', 'socket', 'query failed', 'database system is starting up', 'terminating connection'],

  API: ['ENOTFOUND', 'ECONNRESET', 'socket', 'network', 'timeout', 'econnrefused', 'etimedout', 'request failed', 'empty response'],

  UI: ['timeout', 'TimeoutError', 'element not found', 'locator not found', 'page not found', 'browser disconnected'],

  SSH: ['connection', 'timeout', 'econnrefused', 'etimedout', 'handshake', 'authentication'],
} as const;

/**
 * НЕ ретраемые ошибки (фатальные, сразу падаем)
 */
export const NON_RETRYABLE_ERRORS = {
  DATABASE: ['syntax error', 'duplicate key', 'unique constraint', 'foreign key constraint', 'permission denied', 'does not exist', 'invalid input syntax'],

  API: [
    '400',
    '401',
    '403',
    '404', // Bad Request, Unauthorized, Forbidden, Not Found
    'validation error',
    'invalid request',
    'malformed json',
  ],

  UI: ['assertion error', 'expect failed', 'validation error', 'invalid selector'],
} as const;

/**
 * Объект для обратной совместимости
 */
export const RETRY_CONFIG = {
  API: API_RETRY_CONFIG,
  DATABASE: DATABASE_RETRY_CONFIG,
  UI: UI_RETRY_CONFIG,
  SSH: SSH_RETRY_CONFIG,
  RETRYABLE_ERRORS,
  NON_RETRYABLE_ERRORS,
} as const;

/**
 * Быстрые хелперы для использования
 */
export const RetryConfigHelpers = {
  /**
   * Получить конфиг по типу операции
   */
  getConfig(type: 'API' | 'DATABASE' | 'UI' | 'SSH') {
    switch (type) {
      case 'API':
        return API_RETRY_CONFIG;
      case 'DATABASE':
        return DATABASE_RETRY_CONFIG;
      case 'UI':
        return UI_RETRY_CONFIG;
      case 'SSH':
        return SSH_RETRY_CONFIG;
      default:
        return API_RETRY_CONFIG;
    }
  },

  /**
   * Проверить, является ли ошибка ретраемой для типа операции
   */
  shouldRetry(error: Error, type: 'API' | 'DATABASE' | 'UI' | 'SSH'): boolean {
    const errorStr = error.toString().toLowerCase();

    // Проверяем фатальные ошибки (НЕ ретраемые)
    const nonRetryable = NON_RETRYABLE_ERRORS[type] || [];
    if (nonRetryable.some((keyword) => errorStr.includes(keyword))) {
      return false;
    }

    // Проверяем ретраемые ошибки
    const retryable = RETRYABLE_ERRORS[type] || [];
    return retryable.some((keyword) => errorStr.includes(keyword));
  },

  /**
   * Получить задержку для попытки (с учётом экспоненциального роста)
   */
  getDelay(attempt: number, type: 'API' | 'DATABASE' | 'UI' | 'SSH'): number {
    const config = this.getConfig(type);
    return config.delay * Math.pow(config.backoff, attempt - 1);
  },

  /**
   * Логирование информации о ретрае
   */
  logRetryInfo(type: 'API' | 'DATABASE' | 'UI' | 'SSH', attempt: number, maxAttempts: number, waitTime: number, error?: Error) {
    const emoji = {
      API: '🌐',
      DATABASE: '🗄️',
      UI: '🎭',
      SSH: '🔐',
    }[type];

    console.log(`${emoji} ${type} retry ${attempt}/${maxAttempts}` + (error ? `: ${error.message}` : '') + ` | Next in ${waitTime}ms`);
  },
};

/**
 * Типы для TypeScript
 */
export type RetryConfigType = keyof typeof RETRY_CONFIG;
export type RetryableErrorType = keyof typeof RETRYABLE_ERRORS;

/**
 * Примеры использования:
 *
 * 1. Импорт конфига:
 *    import { API_RETRY_CONFIG, DATABASE_RETRY_CONFIG } from './config/retry-config';
 *
 * 2. Использование в ретрае:
 *    await retry(operation, API_RETRY_CONFIG);
 *
 * 3. Проверка ошибки:
 *    if (RetryConfigHelpers.shouldRetry(error, 'DATABASE')) { ... }
 *
 * 4. Получение задержки:
 *    const delay = RetryConfigHelpers.getDelay(2, 'API'); // 2000ms
 */
