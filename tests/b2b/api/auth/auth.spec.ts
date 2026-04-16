import { test, expect } from '../../../fixtures/test-setup';

test.describe('B2B Authentication API @smoke @b2b', () => {
  test('should complete full B2B registration flow', async ({ b2bBffClient, b2bAuthContext, b2bTestUser }) => {
    // Проверяем, что тестовый пользователь создан успешно
    const hasAccessToken = b2bTestUser.accessToken;
    const hasRefreshToken = b2bTestUser.refreshToken;
    const hasUserId = b2bTestUser.userId;

    expect(hasAccessToken).toBeTruthy();
    expect(hasRefreshToken).toBeTruthy();
    expect(hasUserId).toBeTruthy();

    // Получаем guest token для экрана логина
    await b2bAuthContext.initialize();
    const guestToken = b2bAuthContext.getGuestToken();
    const deviceId = b2bTestUser.deviceId;

    const headers = {
      Authorization: `Bearer ${guestToken}`,
      'device-id': deviceId,
      'Content-Type': 'application/json',
    };

    // получаем экран
    const authScreenResponse = await b2bBffClient.get('/screen/b2b/auth/phone', { headers });
    const authScreenStatus = authScreenResponse.status;
    const authScreenData = authScreenResponse.data;

    expect(authScreenStatus).toBe(200);
    expect(authScreenData).toMatchObject({
      title: 'Вход в кабинет продавца',
      subTitle: expect.stringContaining('Введите номер, чтобы получить SMS-код'),
      phoneField: {
        placeholder: 'Номер телефона',
      },
      submitButton: {
        title: 'Войти',
      },
    });
  });

  test('should refresh B2B token successfully', async ({ b2bDmlClient, b2bTestUser }) => {
    const headers = {
      Authorization: `Bearer ${b2bTestUser.refreshToken}`,
      'device-id': b2bTestUser.deviceId,
      'user-id': b2bTestUser.userId,
      'Content-Type': 'application/json',
      'X-Client-Type': 'b2b',
    };

    const refreshResponse = await b2bDmlClient.post('/b2b/auth/refresh-token', { headers });
    const responseStatus = refreshResponse.status;
    const responseData = refreshResponse.data;

    expect(responseStatus).toBe(201);
    expect(responseData).toHaveProperty('accessToken');
    expect(responseData).toHaveProperty('refreshToken');

    // @ts-ignore
    const newAccessToken = responseData.accessToken;
    const oldAccessToken = b2bTestUser.accessToken;

    expect(newAccessToken).not.toBe(oldAccessToken);
    expect(newAccessToken).toBeTruthy();
  });
});
