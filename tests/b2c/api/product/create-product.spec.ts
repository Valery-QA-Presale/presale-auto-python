import { expect, test } from '../../../fixtures/test-setup';
import { DataGenerators } from '../../../data/test-data';
import { productCreateResponse } from '../../../fixtures/api-clients/b2b-dml-client';
import { SuccessResponse } from '../../../fixtures/api-clients/b2c-api-client';
import { simpleRetry } from '../../../utils/retry-utils';

test.describe('Create products flow men + woman', () => {
  test('create product men + delete', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMenProduct();
    const headers = authContext.getDefaultHeaders(testUser);
    const requestOptions = { headers: headers, data: product };

    // Создание
    const response = await b2bDmlClient.post<productCreateResponse>('/product/create', requestOptions);
    const responseStatus = response.status;
    const responseData = response.data;
    const productId = responseData.productId;

    if (responseStatus === 400) {
      console.log('❌ Validation errors:', responseData);
    }
    expect(responseStatus).toBe(201);

    // проверяю в списке
    const listHeaders = { ...headers, 'product-id': productId };

    const listResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await apiClient.get<SuccessResponse>('/screen/product-list', { headers: listHeaders });
        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
      },
    );

    expect(listResponse.status).toBe(200);
    const products = listResponse.data.products || listResponse.data;
    // @ts-ignore
    const foundProduct = products.find((p: any) => p.productId === productId);
    expect(foundProduct).toBeDefined();
    expect(foundProduct.productId).toBe(productId);
    expect(foundProduct.title).toBe(product.title);

    // Удаляю после создания
    const deleteHeaders = { ...headers, 'product-id': productId };

    const deleteResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await b2bDmlClient.post('/product/delete', { headers: deleteHeaders });
        if (resp.status !== 201) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Delete product ${productId}`,
      },
    );
    expect(deleteResponse.status).toBe(201);
  });

  test('create product woman + delete', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateWomanProduct();
    const headers = authContext.getDefaultHeaders(testUser);
    const requestOptions = { headers: headers, data: product };

    // ========== 1. СОЗДАЕМ ПРОДУКТ ==========
    const createResponse = await b2bDmlClient.post<productCreateResponse>('/product/create', requestOptions);
    const responseStatus = createResponse.status;
    const responseData = createResponse.data;

    if (responseStatus === 400) {
      console.log('❌ Validation errors:', responseData);
    }

    const productId = responseData.productId;

    expect(responseStatus).toBe(201);
    expect(responseData.productId).toBeDefined();
    expect(typeof responseData.productId).toBe('string');
    // @ts-ignore
    expect(productId.length).toBeGreaterThan(10);

    const listHeaders = { ...headers, 'product-id': productId };

    const listResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await apiClient.get<SuccessResponse>('/screen/product-list', { headers: listHeaders });
        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }

        // Проверяем что продукт появился в списке
        const products = resp.data.products || resp.data;
        // @ts-ignore
        const found = products.find((p: any) => p.productId === productId);
        if (!found) {
          throw new Error(`Product ${productId} not found in list yet`);
        }

        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Verify product ${productId} in list`,
      },
    );

    expect(listResponse.status).toBe(200);
    const products = listResponse.data.products || listResponse.data;
    // @ts-ignore
    const foundProduct = products.find((p: any) => p.productId === productId);

    expect(foundProduct).toBeDefined();
    expect(foundProduct.productId).toBe(productId);
    expect(foundProduct.title).toBe(product.title);

    // Удаляем
    const deleteHeaders = { ...headers, 'product-id': productId };

    const deleteResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await b2bDmlClient.post('/product/delete', { headers: deleteHeaders });
        if (resp.status !== 201) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Delete product ${productId}`,
      },
    );

    expect(deleteResponse.status).toBe(201);
  });

  test('create and update product', async ({ b2bDmlClient, testUser, authContext }) => {
    const product = DataGenerators.generateMinimalProduct({
      title: 'Продукт для обновления',
    });

    const headers = authContext.getDefaultHeaders(testUser);
    const requestOptions = { headers: headers, data: product };

    const response = await b2bDmlClient.post<productCreateResponse>('/product/create', requestOptions);
    const responseStatus = response.status;
    const responseData = response.data;

    if (responseStatus === 400) {
      console.log('❌ Validation errors:', responseData);
    }

    const productId = responseData.productId;

    expect(responseStatus).toBe(201);
    expect(responseData.productId).toBeDefined();
    expect(typeof responseData.productId).toBe('string');
    // @ts-ignore
    expect(responseData.productId.length).toBeGreaterThan(10);

    const updateData = DataGenerators.generateProductUpdateData({
      title: 'Обновленное название ' + Date.now(),
      price: 45000,
      attributes: {
        material: [{ id: 'silk' }],
        color: [{ id: 'black' }],
        condition: { id: 'perfect' },
        year: '2025',
        renovationToggle: true,
        rarityToggle: true,
        brand: { id: 'burberry' },
        model: 'Super-Model-2025',
      },
    });

    const verifyHeaders = {
      ...headers,
      'product-id': productId,
    };

    const updateResponse = await simpleRetry(
      async () => {
        const response = await b2bDmlClient.post<productCreateResponse>(`/product/update`, {
          // @ts-ignore
          headers: verifyHeaders,
          data: updateData,
        });

        if (response.status !== 201) {
          throw new Error(`Expected status 201, got ${response.status}`);
        }
        return response;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: 'Update product price',
      },
    );

    expect(updateResponse.status).toBe(201);

    const deleteHeaders = {
      ...headers,
      'product-id': productId,
    };

    const deleteResponse = await simpleRetry(
      async () => {
        const response = await b2bDmlClient.post('/product/delete', {
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

    expect(deleteResponse.status).toBe(201);
  });
});

test('full product flow with price', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
  const headers = authContext.getDefaultHeaders(testUser);

  const product = DataGenerators.generateMenProduct();

  const createResponse = await b2bDmlClient.post('/product/create', {
    headers,
    data: product,
  });

  expect(createResponse.status).toBe(201);
  // @ts-ignore
  const productId = createResponse.data.productId;

  const priceUpdate = { price: 40000 };
  const updateResponse = await simpleRetry(
    async () => {
      const response = await b2bDmlClient.post('/product/update', {
        headers: { ...headers, 'product-id': productId },
        data: priceUpdate,
      });

      if (response.status !== 201) {
        throw new Error(`Expected status 201, got ${response.status}`);
      }
      return response;
    },
    {
      maxAttempts: 3,
      delay: 1000,
      description: 'Update product price',
    },
  );
  expect(updateResponse.status).toBe(201);

  // Проверка в списке
  const listHeaders = { ...headers, 'product-id': productId };

  const listResponse = await simpleRetry(
    async () => {
      const response = await apiClient.get<SuccessResponse>('/screen/product-list', {
        headers: listHeaders,
      });

      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }

      const found = response.data.products.find((p: any) => p.productId === productId);
      if (!found) {
        throw new Error(`Product ${productId} not found in list yet`);
      }

      return response;
    },
    {
      maxAttempts: 3,
      delay: 1000,
      description: 'Wait for product in list',
    },
  );

  // Проверка цены в списке
  const foundProduct = listResponse.data.products.find((p: any) => p.productId === productId);
  // @ts-ignore
  if (foundProduct.price) {
    // @ts-ignore
    expect(foundProduct.price).toBe(40000);
  }

  // Чекаю комиссию
  const priceResponse = await simpleRetry(
    async () => {
      const response = await apiClient.get<SuccessResponse>('/product/price/calculate', {
        headers: { ...headers, 'price-for-sale': '40000' },
      });

      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
      return response;
    },
    {
      maxAttempts: 3,
      delay: 1000,
      description: 'Calculate commission',
    },
  );

  const actualRevenue = priceResponse.data.revenue;
  expect(actualRevenue).toBe(35200);
  const deleteHeaders = {
    ...headers,
    'product-id': productId,
  };

  const deleteResponse = await simpleRetry(
    async () => {
      const response = await b2bDmlClient.post('/product/delete', {
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

  expect(deleteResponse.status).toBe(201);
});

test.describe('Negative scenarios', () => {
  test('should not create product without required fields', async ({ b2bDmlClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    // Пустой объект
    const response = await b2bDmlClient
      .post('/product/create', {
        headers,
        data: {},
      })
      .catch((e) => e.response);

    expect(response.status).toBe(400);
  });

  test('should not create product with invalid category', async ({ b2bDmlClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const product = DataGenerators.generateMenProduct();

    // Ломаем категорию
    product.category.categoryL1 = 'invalid_category';

    const response = await b2bDmlClient
      .post('/product/create', {
        headers,
        data: product,
      })
      .catch((e) => e.response);

    expect(response.status).toBe(400);
  });

  test('should not update non-existent product', async ({ b2bDmlClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const fakeId = 'NONEXISTENT_123';

    const updateData = { title: 'New Title' };

    const response = await b2bDmlClient
      .post(`/product/update`, {
        headers: { ...headers, 'product-id': fakeId },
        data: updateData,
      })
      .catch((e) => e.response);

    expect(response.status).toBe(400);
  });
});
