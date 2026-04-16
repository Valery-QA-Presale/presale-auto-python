import { test, expect } from '../../../fixtures/test-setup';

test.describe.configure({ mode: 'serial' });
test.describe('Authentication API @smoke @b2c', () => {
  test('should complete full registration flow', async ({ apiClient, authContext, testUser }) => {
    const hasAccessToken = testUser.accessToken;
    const hasRefreshToken = testUser.refreshToken;
    const hasUserId = testUser.userId;

    expect(hasAccessToken).toBeTruthy();
    expect(hasRefreshToken).toBeTruthy();
    expect(hasUserId).toBeTruthy();

    const headers = authContext.getDefaultHeaders(testUser);
    const profileResponse = await apiClient.get('/screen/profile/personal-info', { headers });
    const responseStatus = profileResponse.status;
    const responseData = profileResponse.data;

    expect(responseStatus).toBe(200);
    expect(responseData).toHaveProperty('firstName');
    expect(responseData).toHaveProperty('lastName');
  });

  test('should refresh tokens successfully', async ({ apiClient, authContext, testUser }) => {
    const headers = {
      Authorization: `Bearer ${testUser.refreshToken}`,
      'device-id': testUser.deviceId,
      'user-id': testUser.userId,
      'Content-Type': 'application/json',
    };

    const refreshResponse = await apiClient.post('/auth/refresh-token', { headers });
    const responseStatus = refreshResponse.status;
    const responseData = refreshResponse.data;

    expect(responseStatus).toBe(201);
    expect(responseData).toHaveProperty('accessToken');
    expect(responseData).toHaveProperty('refreshToken');

    // @ts-ignore
    const newAccessToken = refreshResponse.data.accessToken;
    const oldAccessToken = testUser.accessToken;

    expect(newAccessToken).not.toBe(oldAccessToken);
  });
});
