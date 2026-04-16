import { test, expect } from '../../../fixtures/test-setup';
import { MyLotsValidator } from '../../../utils/validators/lots/my-lots.validator';
import { ENDPOINTS } from '../../../data/constants/index';
import { LotsActiveValidator } from '../../../utils/validators/lots/lots-active.validator';
import { LotsActiveListValidator } from '../../../utils/validators/lots/lots-active-list.validator';
import { LotsHistoryValidator } from '../../../utils/validators/lots/lots-history.validator';
import { LotsHistoryListValidator } from '../../../utils/validators/lots/lots-history-list.validator';
import { ProductsDraftValidator } from '../../../utils/validators/lots/products-draft.validator';
import { ProductListValidator } from '../../../utils/validators/lots/product-list.validator';
import { TelegramNotifier } from '../../../utils/telegram/telegram-notifier';

test.describe('Get lots flow', () => {
  test('GET /my-lots validate full response tree', async ({ apiClient, testUser, authContext }) => {
    // await TelegramNotifier.sendMessage('🧪 Прямой тест из теста');
    // expect(true).toBe(true);
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.MY_LOTS, { headers });

    expect(response.status).toBe(200);

    MyLotsValidator.validate(response.data);

    // доп проверки
    // @ts-ignore
    expect(response.data.steps.length).toBe(3);
    // @ts-ignore
    expect(response.data.createLotButton.deeplink).toMatch(/^presale-app:\/\//);
    // @ts-ignore
    expect(response.data.legalSection.button.deeplink).toMatch(/^https?:\/\//);
  });
  test('GET /screen/lots-active validate full response tree (empty state)', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.ACTIVE, { headers });

    expect(response.status).toBe(200);

    LotsActiveValidator.validate(response.data);

    // доп проверка наверняка
    // @ts-ignore
    expect(response.data.imageUrl).toBe('');
    // @ts-ignore
    expect(response.data.createLotButton.deeplink).toBe('');
  });

  test(' GET /screen/lots-active-list validate full response tree', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.ACTIVE_LIST, { headers });

    expect(response.status).toBe(200);

    LotsActiveListValidator.validate(response.data);
  });

  test('GET /screen/lots-history validate full response tree (empty state)', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.HISTORY, { headers });

    expect(response.status).toBe(200);

    LotsHistoryValidator.validate(response.data);
    // Доп проверки
    // @ts-ignore
    expect(response.data.imageUrl).toBe('');
    // @ts-ignore
    expect(response.data.createLotButton.deeplink).toBe('');
  });

  test('GET /screen/lots-history-list validate full response tree ', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.HISTORY_LIST, { headers });

    expect(response.status).toBe(200);

    LotsHistoryListValidator.validate(response.data);
  });

  test('GET /screen/products-draft validate full response tree (empty state)', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.PRODUCTS_DRAFT, { headers });

    expect(response.status).toBe(200);

    ProductsDraftValidator.validate(response.data);

    // @ts-ignore
    expect(response.data.imageUrl).toBe('');
    // @ts-ignore
    expect(response.data.createLotButton.deeplink).toBe('');
  });

  test('GET /screen/product-list validate full response tree', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.LOTS.GET.DRAFT_LIST, { headers });

    expect(response.status).toBe(200);

    ProductListValidator.validate(response.data);
  });
});
