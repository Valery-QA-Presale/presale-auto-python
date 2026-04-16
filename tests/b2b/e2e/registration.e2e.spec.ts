import { expect, test } from '../../fixtures/test-setup';
import { TestDataGenerator } from '../../data/test-data';
import { ShopRegistrationResponse } from '../../fixtures/api-clients/b2b-dml-client';
import { SuccessResponseB2b } from '../../fixtures/api-clients/b2b-bff-client';
import { simpleRetry, waitForCondition } from '../../utils/retry-utils';

test.describe('B2B Shop Registration @e2e', () => {
  test('should register individual-Entrepreneur shop after B2B account creation', async ({ b2bBffClient, b2bAuthContext, b2bDmlClient, freshB2BUser }) => {
    // данные для регистрации магазина
    const individualEntrepreneur = TestDataGenerator.generateRUSIndividualEntrepreneurShop();
    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);
    const registrationResponse = await simpleRetry(
      () =>
        b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: individualEntrepreneur,
        }),
      {
        maxAttempts: 3,
        delay: 2000,
        description: 'B2B Individual Entrepreneur registration',

        validateResponse: (response) => response.status === 200,
      },
    );

    // Возвращает 200 OK всегда для упрощения фронтенда
    expect(registrationResponse.status).toBe(200);
    const responseData = registrationResponse.data;
    expect(responseData.success).toBe(true);
    expect(responseData.registrationId).toBeTruthy();
    expect(responseData.registrationId.length).toBeGreaterThan(5);
    expect(responseData.registrationId).toMatch(/^[A-Z0-9]+$/);

    const getResponse = await b2bBffClient.get<SuccessResponseB2b>('/screen/b2b/registration/success', { headers });
    const getResponseStatus = getResponse.status;
    const getResponseData = getResponse.data;
    // Upsert операция: создание или обновление черновика
    // Возвращает 200 OK всегда для упрощения фронтенда
    expect(getResponseStatus).toBe(200);

    expect(getResponseData).toHaveProperty('title', 'Заявка успешно оформлена!');
    expect(getResponseData).toHaveProperty('subTitle', 'Ваш магазин на шаг ближе к старту.');
    expect(getResponseData).toHaveProperty('description', 'В течение 24 часов наша команда свяжется с' + ' вами, чтобы обсудить детали и помочь запуститься на платформе');
    expect(getResponseData).toHaveProperty('subHeading', 'А пока можете продолжить пользоваться приложением');
    expect(getResponseData).toHaveProperty('qr');
  });

  test('should register self-employed shop after B2B account creation', async ({ b2bBffClient, b2bDmlClient, b2bAuthContext, freshB2BUser }) => {
    // данные для регистрации магазина
    const selfEmployedShop = TestDataGenerator.generateRUSelfEmployedShop();

    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);
    const registrationResponse = await simpleRetry(
      () =>
        b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: selfEmployedShop,
        }),
      {
        maxAttempts: 3,
        delay: 2000,
        description: 'B2B self-employed registration',

        validateResponse: (response) => response.status === 200,
      },
    );

    // Upsert операция: создание или обновление черновика
    // Возвращает 200 OK всегда для упрощения фронтенда
    expect(registrationResponse.status).toBe(200);
    const responseData = registrationResponse.data;
    expect(responseData.success).toBe(true);
    expect(responseData.registrationId).toBeTruthy();
    expect(responseData.registrationId.length).toBeGreaterThan(5);
    expect(responseData.registrationId).toMatch(/^[A-Z0-9]+$/);

    const getResponse = await b2bBffClient.get<SuccessResponseB2b>('/screen/b2b/registration/success', { headers });
    const getResponseStatus = getResponse.status;
    const getResponseData = getResponse.data;
    expect(getResponseStatus).toBe(200);
    expect(getResponseData).toHaveProperty('title', 'Заявка успешно оформлена!');
    expect(getResponseData).toHaveProperty('subTitle', 'Ваш магазин на шаг ближе к старту.');
    expect(getResponseData).toHaveProperty('description', 'В течение 24 часов наша команда свяжется с' + ' вами, чтобы обсудить детали и помочь запуститься на платформе');
    expect(getResponseData).toHaveProperty('subHeading', 'А пока можете продолжить пользоваться приложением');
    expect(getResponseData).toHaveProperty('qr');
  });

  test('should registerLLC shop shop after B2B account creation', async ({ b2bBffClient, b2bDmlClient, b2bAuthContext, freshB2BUser }) => {
    // данные для регистрации магазина
    const llcShop = TestDataGenerator.generateRULLCShop();
    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);
    const registrationResponse = await simpleRetry(
      () =>
        b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: llcShop,
        }),
      {
        maxAttempts: 3,
        delay: 2000,
        description: 'B2B registerLLC registration',

        validateResponse: (response) => response.status === 200,
      },
    );
    // Upsert операция: создание или обновление черновика
    // Возвращает 200 OK всегда для упрощения фронтенда
    expect(registrationResponse.status).toBe(200);
    const responseData = registrationResponse.data;
    expect(responseData.success).toBe(true);
    expect(responseData.registrationId).toBeTruthy();
    expect(responseData.registrationId.length).toBeGreaterThan(5);
    expect(responseData.registrationId).toMatch(/^[A-Z0-9]+$/);

    const getResponse = await b2bBffClient.get<SuccessResponseB2b>('/screen/b2b/registration/success', { headers });
    const getResponseStatus = getResponse.status;
    const getResponseData = getResponse.data;
    expect(getResponseStatus).toBe(200);
    expect(getResponseData).toHaveProperty('title', 'Заявка успешно оформлена!');
    expect(getResponseData).toHaveProperty('subTitle', 'Ваш магазин на шаг ближе к старту.');
    expect(getResponseData).toHaveProperty('description', 'В течение 24 часов наша команда свяжется с' + ' вами, чтобы обсудить детали и помочь запуститься на платформе');
    expect(getResponseData).toHaveProperty('subHeading', 'А пока можете продолжить пользоваться приложением');
    expect(getResponseData).toHaveProperty('qr');
  });

  test('should other shop after B2B account creation', async ({ b2bBffClient, b2bDmlClient, b2bAuthContext, freshB2BUser }) => {
    // данные для регистрации магазина
    const otherShop = TestDataGenerator.generateOtherShop();
    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);
    const registrationResponse = await simpleRetry(
      () =>
        b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: otherShop,
        }),
      {
        maxAttempts: 3,
        delay: 2000,
        description: 'B2B other shop registration',

        validateResponse: (response) => response.status === 200,
      },
    );
    // Возвращает 200 OK всегда для упрощения фронтенда
    expect(registrationResponse.status).toBe(200);
    const responseData = registrationResponse.data;
    expect(responseData.success).toBe(true);
    expect(responseData.registrationId).toBeTruthy();
    expect(responseData.registrationId.length).toBeGreaterThan(5);
    expect(responseData.registrationId).toMatch(/^[A-Z0-9]+$/);

    const getResponse = await b2bBffClient.get<SuccessResponseB2b>('/screen/b2b/registration/success', { headers });
    const getResponseStatus = getResponse.status;
    const getResponseData = getResponse.data;
    expect(getResponseStatus).toBe(200);
    expect(getResponseData).toHaveProperty('title', 'Заявка успешно оформлена!');
    expect(getResponseData).toHaveProperty('subTitle', 'Ваш магазин на шаг ближе к старту.');
    expect(getResponseData).toHaveProperty('description', 'В течение 24 часов наша команда свяжется с' + ' вами, чтобы обсудить детали и помочь запуститься на платформе');
    expect(getResponseData).toHaveProperty('subHeading', 'А пока можете продолжить пользоваться приложением');
    expect(getResponseData).toHaveProperty('qr');
  });
  test('should random shop after B2B account creation', async ({ b2bDmlClient, b2bAuthContext, freshB2BUser, b2bBffClient }) => {
    // данные для регистрации магазина
    const randomShop = TestDataGenerator.generateRandomShopData();
    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);
    const registrationResponse = await simpleRetry(
      () =>
        b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: randomShop,
        }),
      {
        maxAttempts: 3,
        delay: 2000,
        description: 'B2B random shop registration',

        validateResponse: (response) => response.status === 200,
      },
    );
    // Возвращает 200 OK всегда для упрощения фронтенда
    expect(registrationResponse.status).toBe(200);
    const responseData = registrationResponse.data;
    expect(responseData.success).toBe(true);
    expect(responseData.registrationId).toBeTruthy();
    expect(responseData.registrationId.length).toBeGreaterThan(5);
    expect(responseData.registrationId).toMatch(/^[A-Z0-9]+$/);

    const getResponse = await b2bBffClient.get<SuccessResponseB2b>('/screen/b2b/registration/success', { headers });
    const getResponseStatus = getResponse.status;
    const getResponseData = getResponse.data;
    expect(getResponseStatus).toBe(200);
    expect(getResponseData).toHaveProperty('title', 'Заявка успешно оформлена!');
    expect(getResponseData).toHaveProperty('subTitle', 'Ваш магазин на шаг ближе к старту.');
    expect(getResponseData).toHaveProperty('description', 'В течение 24 часов наша команда свяжется с' + ' вами, чтобы обсудить детали и помочь запуститься на платформе');
    expect(getResponseData).toHaveProperty('subHeading', 'А пока можете продолжить пользоваться приложением');
    expect(getResponseData).toHaveProperty('qr');
  });
});
test.describe('work with database @e2e', () => {
  test('store registration → check in the database with correct connections', async ({ b2bDmlClient, freshB2BUser, b2bAuthContext, db }) => {
    // 1. Создаем магазин через API с ретраем и валидацией
    const shopData = TestDataGenerator.generateRUSelfEmployedShop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);

    shopData.email = `autotest_${timestamp}_${random}@test.ru`;
    shopData.shopName = `Автотест Магазин ${timestamp}_${random}`;

    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);

    // 🔥 API вызов с ретраем и валидацией
    const apiResponse = await simpleRetry(
      () =>
        b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: shopData,
        }),
      {
        maxAttempts: 3,
        delay: 2000,
        description: 'B2B shop registration API',
        validateResponse: (response) => {
          if (response.status !== 200) {
            return `Expected status 200, got ${response.status}`;
          }
          if (!response.data.success) {
            return 'Registration failed (success: false)';
          }
          if (!response.data.registrationId) {
            return 'No registrationId in response';
          }
          return true;
        },
      },
    );

    const registrationId = apiResponse.data.registrationId;

    // API проверки (уже частично сделаны в validateResponse)
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.data.success).toBe(true);

    // 2. Ждем записи в БД с умным ожиданием
    await waitForCondition(
      async () => {
        try {
          const result = await db.query(`SELECT * FROM applications WHERE "registrationId" = $1`, [registrationId]);
          return result.rows.length > 0;
        } catch (error) {
          console.log(`⚠️ DB query failed: ${error.message}`);
          return false;
        }
      },
      {
        timeout: 15000, // 15 секунд для БД
        interval: 1000, // Проверяем каждую секунду
        description: `Application ${registrationId} in database`,
      },
    );

    // 3. Ищем заявку в БД с ретраем
    const dbApplication = await simpleRetry(
      async () => {
        const result = await db.query(`SELECT * FROM applications WHERE "registrationId" = $1`, [registrationId]);

        if (result.rows.length === 0) {
          throw new Error(`Application ${registrationId} not found in DB`);
        }

        return result.rows[0];
      },
      {
        maxAttempts: 5, // Больше попыток для БД
        delay: 2000,
        description: `Find application ${registrationId} in DB`,
      },
    );

    // Проверяем поля application
    expect(dbApplication.shopName).toBe(shopData.shopName);
    expect(dbApplication.inn).toBe(shopData.inn);
    expect(dbApplication.email).toBe(shopData.email);

    // 4. Ждем пока проставится accountId
    await waitForCondition(
      async () => {
        try {
          const result = await db.query(`SELECT "accountId" FROM applications WHERE "registrationId" = $1 AND "accountId" IS NOT NULL`, [registrationId]);
          return result.rows.length > 0;
        } catch (error) {
          return false;
        }
      },
      {
        timeout: 10000,
        interval: 500,
        description: `AccountId for application ${registrationId}`,
      },
    );

    // 5. Ищем аккаунт с ретраем
    const dbAccount = await simpleRetry(
      async () => {
        if (!dbApplication.accountId) {
          // Обновляем данные application
          const refreshed = await db.query(`SELECT * FROM applications WHERE "registrationId" = $1`, [registrationId]);
          if (!refreshed.rows[0].accountId) {
            throw new Error(`accountId still null for ${registrationId}`);
          }
          dbApplication.accountId = refreshed.rows[0].accountId;
        }

        const result = await db.query(`SELECT * FROM accounts WHERE "accountId" = $1`, [dbApplication.accountId]);

        if (result.rows.length === 0) {
          throw new Error(`Account ${dbApplication.accountId} not found`);
        }

        return result.rows[0];
      },
      {
        maxAttempts: 5,
        delay: 2000,
        description: `Find account for application ${registrationId}`,
      },
    );

    // 6. Проверяем JOIN связь с ретраем
    const joinResult = await simpleRetry(
      async () => {
        const result = await db.query(
          `SELECT
          a."registrationId" as app_id,
          a."shopName" as app_name,
          a."accountId" as app_account_id,
          acc."accountId" as acc_id,
          acc."ownerId" as acc_owner_id,
          acc."phoneNumber" as acc_phone
        FROM applications a
        JOIN accounts acc ON a."accountId" = acc."accountId"
        WHERE a."registrationId" = $1`,
          [registrationId],
        );

        if (result.rows.length === 0) {
          throw new Error(`No JOIN result for ${registrationId}`);
        }

        return result.rows[0];
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `JOIN application-account for ${registrationId}`,
      },
    );

    // 7. Финальные проверки
    expect(dbAccount.ownerId).toBe(freshB2BUser.userId);
    expect(joinResult.acc_owner_id).toBe(freshB2BUser.userId);
    expect(dbApplication.accountId).toBe(dbAccount.accountId);

    if (freshB2BUser.phone) {
      expect(dbAccount.phoneNumber).toBe(freshB2BUser.phone);
    }

    // Проверяем временные метки
    expect(new Date(dbApplication.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
    expect(new Date(dbAccount.createdAt).getTime()).toBeLessThanOrEqual(Date.now());

    console.log(`✅ Registration ${registrationId} successfully stored in DB with all connections`);
  });

  test('simple check: the store was created → it is in the database', async ({ b2bDmlClient, freshB2BUser, b2bAuthContext, db }) => {
    const shopData = TestDataGenerator.generateRandomShopData();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    shopData.email = `autotest_${timestamp}_${random}@test.ru`;
    shopData.shopName = `Автотест Магазин ${timestamp}_${random}`;

    const headers = b2bAuthContext.getDefaultHeaders(freshB2BUser);

    // 1. Создаём магазин через API с ретраем
    const apiResponse = await simpleRetry(
      async () => {
        const response = await b2bDmlClient.post<ShopRegistrationResponse>('/b2b/registration', {
          headers,
          data: shopData,
        });

        // Проверка статуса прямо в коллбеке
        if (response.status !== 200) {
          throw new Error(`Expected 200, got ${response.status}`);
        }

        if (!response.data.success) {
          throw new Error('Shop creation failed (success: false)');
        }

        if (!response.data.registrationId) {
          throw new Error('No registrationId in response');
        }

        return response;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: 'Create shop via API',
      },
    );

    const registrationId = apiResponse.data.registrationId;

    // 2. Проверяем API ответ
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.data.success).toBe(true);

    // 3. Вместо setTimeout(1000) - умное ожидание в БД
    await waitForCondition(
      async () => {
        try {
          const dbResult = await db.query(`SELECT 1 FROM applications WHERE "registrationId" = $1`, [registrationId]);
          return dbResult.rows.length > 0;
        } catch (error) {
          return false; // Игнорируем ошибки БД, продолжаем ждать
        }
      },
      {
        timeout: 1, // Ждём до 10 секунд
        interval: 500, // Проверяем каждые 500мс
        description: `Shop ${registrationId} in database`,
      },
    );

    // 4. Получаем данные для проверок
    const dbResult = await db.query(
      `SELECT "registrationId", "shopName", "email"
     FROM applications
     WHERE "registrationId" = $1`,
      [registrationId],
    );

    // 5. Проверяем что нашли запись
    // @ts-ignore
    expect(dbResult.rows.length).toBe(1, 'Магазин должен быть в БД!');
    const foundShop = dbResult.rows[0];

    // 6. Проверяем что данные совпадают
    expect(foundShop.registrationId).toBe(registrationId);
    expect(foundShop.email).toBe(shopData.email);
    expect(foundShop.shopName).toBe(shopData.shopName);

    console.log(`✅ Shop ${registrationId} successfully created and found in DB`);
  });
});
