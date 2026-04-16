import { expect, test } from '../../../fixtures/test-setup';
import { CategoriesValidator } from '../../../utils/validators/product-validators/categories.validator';
import { ProductInfoValidator } from '../../../utils/validators/product-validators/product-info.validator';
import { BrandsValidator } from '../../../utils/validators/product-validators/brands.validator';
import { SizeValidator } from '../../../utils/validators/product-validators/size.validator';
import { MaterialValidator } from '../../../utils/validators/product-validators/material.validator';
import { ColorValidator } from '../../../utils/validators/product-validators/color.validator';
import { CompleteSetValidator } from '../../../utils/validators/product-validators/complete-set.validator';
import { UsageTracesValidator } from '../../../utils/validators/product-validators/usage-traces.validator';
import { ProductImagesValidator } from '../../../utils/validators/product-validators/product-images.validator';
import { ProductDescriptionValidator } from '../../../utils/validators/product-validators/product-description.validator';
import { AddressesListValidator } from '../../../utils/validators/product-validators/addresses-list.validator';
import { PaymentsCardsListValidator } from '../../../utils/validators/product-validators/payments-cards-list.validator';
import { ProductPriceValidator } from '../../../utils/validators/product-validators/product-price.validator';
import { SummaryPageValidator } from '../../../utils/validators/product-validators/summary-page.validator';
import { DataGenerators } from '../../../data/test-data';
import { simpleRetry } from '../../../utils/retry-utils';
import { ThankYouPageValidator } from '../../../utils/validators/product-validators/thank-you-page.validator';
import { ProductListValidator } from '../../../utils/validators/product-validators/product-list.validator';
import { SuccessResponse } from '../../../fixtures/api-clients/b2c-api-client';
import { PriceCalculateValidator } from '../../../utils/validators/product-validators/price-calculate.validator';
import { PRODUCTS_ENDPOINTS } from '../../../data/constants/index';

test.describe('Get product screen tests', () => {
  test.describe('Get product screen Attributes', () => {
    test('GET /screen/categories - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/categories', { headers });

      expect(response.status).toBe(200);
      expect(response.status).toBe(200);

      //  Валидируем всё одной строкой!
      CategoriesValidator.validate(response.data);
    });

    test('GET /screen/brands - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/brands', { headers });

      expect(response.status).toBe(200);

      BrandsValidator.validate(response.data);

      // @ts-ignore
      const totalBrands = response.data.brandSections.reduce((acc: number, section: any) => acc + section.brands.length, 0);
    });

    test('GET /screen/size - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      // 1. Получаем ответ
      const headers = authContext.getDefaultHeaders(testUser);
      const verifyHeaders = {
        ...headers,
        'category-l1': 'men',
        'category-l2': 'men_clothing',
      };
      const response = await apiClient.get('/screen/size', { headers: verifyHeaders });

      expect(response.status).toBe(200);

      SizeValidator.validate(response.data);

      // @ts-ignore
      const totalSizes = response.data.localeSection.reduce((acc: number, section: any) => acc + section.sizesTable.length, 0);
      // @ts-ignore
    });
    test('GET /screen/material - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      // 1. Получаем ответ
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/material', { headers });

      expect(response.status).toBe(200);

      // 3. Валидируем всё одной строкой!
      MaterialValidator.validate(response.data);
    });

    test('GET /screen/color - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      // 1. Получаем ответ
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/color', { headers });

      expect(response.status).toBe(200);

      ColorValidator.validate(response.data);
    });
    test('GET /screen/complete-set - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/complete-set', { headers });

      expect(response.status).toBe(200);

      CompleteSetValidator.validate(response.data);
    });

    test('GET /screen/usage-traces - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      // 1. Получаем ответ
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/usage-traces', { headers });

      expect(response.status).toBe(200);

      UsageTracesValidator.validate(response.data);
    });

    test('GET /screen/product/images - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      // 1. Получаем ответ
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/product/images', { headers });

      expect(response.status).toBe(200);

      ProductImagesValidator.validate(response.data);

      // @ts-ignore
      response.data.photoSections.forEach((section: any) => {});
    });
  });
  test('GET /screen/product-info - validate full response tree', async ({ apiClient, testUser, authContext }) => {
    // 1. Получаем ответ
    const headers = authContext.getDefaultHeaders(testUser);
    const verifyHeaders = {
      ...headers,
      'category-id': 'clothing',
    };
    const response = await apiClient.get('/screen/product-info', { headers: verifyHeaders });

    expect(response.status).toBe(200);

    ProductInfoValidator.validate(response.data);
  });
  test.describe('Get product screen description, addresses, card-list,price ', () => {
    test('GET /screen/product/description - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/product/description', { headers });

      expect(response.status).toBe(200);

      ProductDescriptionValidator.validate(response.data);
    });

    test('GET /screen/product/addresses-list - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/product/addresses-list', { headers });

      expect(response.status).toBe(200);

      AddressesListValidator.validate(response.data);
    });

    test('GET /screen/product/payments-cards-list - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/product/payments-cards-list', { headers });

      expect(response.status).toBe(200);

      PaymentsCardsListValidator.validate(response.data);
    });
    test('GET /screen/product/price - validate full response tree', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/product/price', { headers });

      expect(response.status).toBe(200);

      ProductPriceValidator.validate(response.data);
    });
  });

  test.describe('GET /screen/product/summary-page  ', () => {
    test('empty draft (no productId)', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);
      const response = await apiClient.get('/screen/product/summary-page', { headers });

      expect(response.status).toBe(200);

      SummaryPageValidator.validate(response.data, { hasProductId: false });
    });

    test('filled draft (with productId)', async ({ apiClient, b2bDmlClient, testUser, authContext }) => {
      //  создаем продукт
      const product = DataGenerators.generateMockMenProduct();
      const headers = authContext.getDefaultHeaders(testUser);

      const createResponse = await b2bDmlClient.post('/product/create', {
        headers,
        data: product,
      });

      // @ts-ignore
      const productId = createResponse.data.productId;

      //  запрашиваем summary-page с productId
      const summaryHeaders = {
        ...headers,
        'product-id': productId,
      };

      const getSummaryResponse = await simpleRetry(
        async () => {
          // @ts-ignore
          const response = await apiClient.get('/screen/product/summary-page', {
            headers: summaryHeaders,
          });
          if (response.status !== 200) {
            throw new Error(`Expected status 201, got ${response.status}`);
          }
          return response;
        },
        {
          maxAttempts: 3,
          delay: 1000,
          description: 'Get created product',
        },
      );
      const responseStatus = getSummaryResponse.status;
      const responseData = getSummaryResponse.data;
      expect(responseStatus).toBe(200);

      // Валидация заполненного черновика
      SummaryPageValidator.validate(responseData, { hasProductId: true });

      const deleteHeaders = {
        ...headers,
        'product-id': productId,
      };
      const deleteResponse = await simpleRetry(
        async () => {
          const response = await b2bDmlClient.post(PRODUCTS_ENDPOINTS.DML.DELETE, {
            // @ts-ignore
            headers: deleteHeaders,
          });

          if (response.status !== 201) {
            throw new Error(`Expected status 201, got ${response.status}`);
          }
          return response;
        },
        {
          maxAttempts: 3,
          delay: 1000,
          description: `Delete product ${productId}`,
        },
      );
      const deleteResponseData = deleteResponse.data;
      // @ts-ignore
      expect(deleteResponseData.success).toBe(true);
      // @ts-ignore
      expect(deleteResponseData.message).toBe('Данные удалены');
      // @ts-ignore
      expect(deleteResponseData.closeButton).toBe(true);
    });
  });

  test('GET /screen/product/TYP - validate thank you page', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const response = await apiClient.get('/screen/product/TYP', { headers });
    expect(response.status).toBe(200);
    ThankYouPageValidator.validate(response.data);
  });

  test.describe('GET /screen/product-list', () => {
    test('should return empty list when no products', async ({ apiClient, freshB2CUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(freshB2CUser);
      const response = await apiClient.get('/screen/product-list', { headers });

      expect(response.status).toBe(200);
      ProductListValidator.validate(response.data, { hasProducts: false });
    });

    test('should return list with products', async ({ apiClient, b2bDmlClient, testUser, authContext }) => {
      const product = DataGenerators.generateMockMenProduct();
      const productHeaders = authContext.getDefaultHeaders(testUser);

      const createResponse = await b2bDmlClient.post('/product/create', {
        headers: productHeaders,
        data: product,
      });
      // @ts-ignore
      const productId = createResponse.data.productId;
      const summaryHeaders = authContext.getDefaultHeaders(testUser);
      const getSummaryResponse = await simpleRetry(
        async () => {
          const response = await apiClient.get('/screen/product-list', {
            headers: summaryHeaders,
          });
          if (response.status !== 200) {
            throw new Error(`Expected status 201, got ${response.status}`);
          }
          return response;
        },
        {
          maxAttempts: 3,
          delay: 1000,
          description: 'Get created product',
        },
      );

      expect(getSummaryResponse.status).toBe(200);
      // Валидация списка с продуктами
      ProductListValidator.validate(getSummaryResponse.data, { hasProducts: true });
      const deleteHeaders = {
        ...productHeaders,
        'product-id': productId,
      };
      const deleteResponse = await simpleRetry(
        async () => {
          const response = await b2bDmlClient.post(PRODUCTS_ENDPOINTS.DML.DELETE, {
            // @ts-ignore
            headers: deleteHeaders,
          });

          if (response.status !== 201) {
            throw new Error(`Expected status 201, got ${response.status}`);
          }
          return response;
        },
        {
          maxAttempts: 3,
          delay: 1000,
          description: `Delete product ${productId}`,
        },
      );
      const deleteResponseData = deleteResponse.data;
      // @ts-ignore
      expect(deleteResponseData.success).toBe(true);
      // @ts-ignore
      expect(deleteResponseData.message).toBe('Данные удалены');
      // @ts-ignore
      expect(deleteResponseData.closeButton).toBe(true);
    });
  });

  test.describe('GET /product/price/calculate', () => {
    test('should calculate revenue for all ranges', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);

      const testCases = [
        { price: 5000, expected: 2000 }, // фикс: 5000 - 3000
        { price: 10000, expected: 7000 }, // фикс: 10000 - 3000
        { price: 14999, expected: 11999 }, // фикс: 14999 - 3000
        { price: 15000, expected: 13200 }, // 12%: 15000 × 0.88
        { price: 25000, expected: 22000 }, // 12%: 25000 × 0.88
        { price: 49999, expected: 43999 }, // 12%: 49999 × 0.88
        { price: 50000, expected: 45000 }, // 10%: 50000 × 0.90
        { price: 100000, expected: 90000 }, // 10%: 100000 × 0.90
      ];

      for (const testCase of testCases) {
        const requestHeaders = {
          ...headers,
          'price-for-sale': testCase.price.toString(),
        };

        const response = await apiClient.get<SuccessResponse>('/product/price/calculate', {
          headers: requestHeaders,
        });
        expect(response.status).toBe(200);
        PriceCalculateValidator.validate(response.data, { price: testCase.price });
      }
    });

    test('should handle boundary values', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);

      const boundaries = [
        { price: 14999, expected: 11999 },
        { price: 15000, expected: 13200 },
        { price: 49999, expected: 43999 },
        { price: 50000, expected: 45000 },
      ];

      for (const boundary of boundaries) {
        const requestHeaders = {
          ...headers,
          'price-for-sale': boundary.price.toString(),
        };

        const response = await apiClient.get<SuccessResponse>('/product/price/calculate', {
          headers: requestHeaders,
        });

        expect(response.status).toBe(200);

        // 👇 СНАЧАЛА ОКРУГЛЯЕМ
        const roundedData = {
          revenue: Math.round(response.data.revenue),
        };

        PriceCalculateValidator.validate(roundedData, { price: boundary.price });
      }
    });

    test('should return 0 for price below minimum', async ({ apiClient, testUser, authContext }) => {
      const headers = authContext.getDefaultHeaders(testUser);

      const lowPrices = [4999, 4000, 3000, 1000, 0, -100];

      for (const price of lowPrices) {
        const requestHeaders = {
          ...headers,
          'price-for-sale': price.toString(),
        };

        const response = await apiClient.get<SuccessResponse>('/product/price/calculate', {
          headers: requestHeaders,
        });
        expect(response.status).toBe(200);
        PriceCalculateValidator.validate(response.data, { price });
      }
    });
  });
});
