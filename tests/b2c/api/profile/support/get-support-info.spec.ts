import { test, expect } from '../../../../fixtures/test-setup';
import { ENDPOINTS } from '../../../../data/constants/index';
import { SupportScreenValidator } from '../../../../utils/validators/support/support-screen.validator';

test.describe('GET /screen/support', () => {
  test('should return valid support screen structure', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const response = await apiClient.get(ENDPOINTS.PROFILE.GET.SUPPORT, { headers });
    expect(response.status).toBe(200);
    SupportScreenValidator.validate(response.data);
  });
});
