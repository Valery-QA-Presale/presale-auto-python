import { test, expect } from '../../../../fixtures/test-setup';
import { PersonalInfoValidator } from '../../../../utils/validators/profile/personal-info.validator';
import { ENDPOINTS } from '../../../../data/constants/index';
import { EmailScreenValidator } from '../../../../utils/validators/profile/email-screen.validator';

test.describe('Get Personal Info screen tests', () => {
  test('should get personal info for authenticated user', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const response = await apiClient.get(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, { headers });
    expect(response.status).toBe(200);

    PersonalInfoValidator.validate(response.data);
  });

  test.describe('GET /screen/profile/email', () => {
    test('should return valid email screen structure', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);

      const response = await apiClient.get(ENDPOINTS.PROFILE.GET.EMAIL_SCREEN, { headers });

      expect(response.status).toBe(200);

      EmailScreenValidator.validate(response.data);
    });
  });
});

test.describe('Negative scenarios ', () => {
  test('should return 401 for invalid token', async ({ apiClient, testUser }) => {
    const invalidHeaders = {
      Authorization: 'Bearer invalid_token_123',
      'device-id': testUser.deviceId,
      'user-id': testUser.userId,
      'Content-Type': 'application/json',
    };
    const requestOptions = { headers: invalidHeaders };

    const response = await apiClient.get(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, requestOptions);
    const responseStatus = response.status;

    expect(responseStatus).toBe(401);
  });

  test('should return 401 without authorization header', async ({ apiClient }) => {
    const headers = { 'Content-Type': 'application/json' };
    const requestOptions = { headers: headers };

    const response = await apiClient.get(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, requestOptions);
    const responseStatus = response.status;

    expect(responseStatus).toBe(401);
  });
});
