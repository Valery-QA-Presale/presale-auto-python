import { test, expect } from '../../../../fixtures/test-setup';
import { ENDPOINTS } from '../../../../data/constants/index';
import { NotificationsScreenValidator } from '../../../../utils/validators/notifications/notifications-screen.validator';

test.describe('GET /screen/notifications', () => {
  test('should return valid notifications screen structure', async ({ apiClient, freshB2CUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(freshB2CUser);

    const response = await apiClient.get(ENDPOINTS.PROFILE.GET.NOTIFICATIONS, { headers });

    expect(response.status).toBe(200);
    NotificationsScreenValidator.validate(response.data);
  });

  // TODO: 23.03.2026 - Не рабочий имейл, необходимо дописать тесты
});
