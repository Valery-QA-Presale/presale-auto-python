import { expect, test } from '../../../fixtures/test-setup';
import { ENDPOINTS } from '../../../data/constants/index';
import { CatalogMainWomanValidator } from '../../../utils/validators/catalog/catalog-main-woman';
import { CatalogMainMenValidator } from '../../../utils/validators/catalog/catalog-main-man';
import { CategoryL3Validator } from '../../../utils/validators/catalog/category-L3';
import { CategoryL4Validator } from '../../../utils/validators/catalog/category-L4';
import { CategoryValidator } from '../../../utils/validators/catalog/category';

test.describe('Get catalog flow', () => {
  test('GET /catalog-main-woman validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATALOG_MAIN_WOMAN, { headers });

    expect(response.status).toBe(200);
    CatalogMainWomanValidator.validate(response.data);
  });
  test('GET /catalog-main-woman validate full response tree no Auth', async ({ apiClient, guestUser, authContext }) => {
    const headers = authContext.getGuestAuthHeaders(guestUser);

    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATALOG_MAIN_WOMAN, { headers });

    expect(response.status).toBe(200);
    CatalogMainWomanValidator.validate(response.data);
  });

  test(' GET /catalog-main-man validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATALOG_MAIN_MAN, { headers });

    expect(response.status).toBe(200);

    CatalogMainMenValidator.validate(response.data);
  });

  test(' GET /catalog-main-man validate full response tree no Auth', async ({ apiClient, guestUser, authContext }) => {
    const headers = authContext.getGuestAuthHeaders(guestUser);

    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATALOG_MAIN_MAN, { headers });

    expect(response.status).toBe(200);

    CatalogMainMenValidator.validate(response.data);
  });

  test(' GET /category-L3 man validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const getHeaders = {
      ...headers,
      'category-id': 'men_clothing',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L3, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL3Validator.validate(response.data);
  });
  test(' GET /category-L3 man validate full response tree no Auth', async ({ apiClient, guestUser, authContext }) => {
    const headers = authContext.getGuestAuthHeaders(guestUser);

    const getHeaders = {
      ...headers,
      'category-id': 'men_clothing',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L3, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL3Validator.validate(response.data);
  });

  test(' GET /category-L3 woman validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const getHeaders = {
      ...headers,
      'category-id': 'woman_clothing',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L3, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL3Validator.validate(response.data);
  });
  test(' GET /category-L3 woman validate full response tree no Auth', async ({ apiClient, guestUser, authContext }) => {
    const headers = authContext.getGuestAuthHeaders(guestUser);

    const getHeaders = {
      ...headers,
      'category-id': 'woman_clothing',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L3, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL3Validator.validate(response.data);
  });

  test(' GET /category-L4 man validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const getHeaders = {
      ...headers,
      'category-id': 'men_clothing_clothing-outerwear',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L4, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL4Validator.validate(response.data);
  });
  test(' GET /category-L4 man validate full response tree no Auth', async ({ apiClient, guestUser, authContext }) => {
    const headers = authContext.getGuestAuthHeaders(guestUser);

    const getHeaders = {
      ...headers,
      'category-id': 'men_clothing_clothing-outerwear',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L4, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL4Validator.validate(response.data);
  });

  test(' GET /category-L4 woman validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const getHeaders = {
      ...headers,
      'category-id': 'woman_clothing_clothing-outerwear',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L4, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL4Validator.validate(response.data);
  });
  test(' GET /category-L4 woman validate full response tree no Auth', async ({ apiClient, guestUser, authContext }) => {
    const headers = authContext.getGuestAuthHeaders(guestUser);

    const getHeaders = {
      ...headers,
      'category-id': 'woman_clothing_clothing-outerwear',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.CATEGORY_L4, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryL4Validator.validate(response.data);
  });
  test(' GET /category  validate full response tree with Auth', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const getHeaders = {
      ...headers,
      'category-id': 'men_clothing',
    } as any;
    const response = await apiClient.get(ENDPOINTS.CATALOG.GET.SCREEN_CATEGORY, { headers: getHeaders });

    expect(response.status).toBe(200);

    CategoryValidator.validate(response.data);
  });
});
