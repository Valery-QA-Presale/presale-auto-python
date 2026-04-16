import { test, expect } from '../../../../fixtures/test-setup';
import { ENDPOINTS } from '../../../../data/constants/index';
import { PaymentCardsListValidator } from '../../../../utils/validators/profile/payment-cards-list.validator';
import { SuccessResponse } from '../../../../fixtures/api-clients/b2c-api-client';

test.describe('GET /screen/profile/payment-cards-list', () => {
  test('should return valid payment cards list structure', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.PAYMENT_CARDS_LIST, { headers });

    expect(response.status).toBe(200);

    PaymentCardsListValidator.validate(response.data);

    // Если есть карты, покажем количество
    // @ts-ignore

    if (response.data.cards.length > 0) {
      // @ts-ignore
      console.log(`💳 Default card: ${response.data.cards.find((c: any) => c.isDefault)?.cardId || 'none'}`);
    }
  });
});
