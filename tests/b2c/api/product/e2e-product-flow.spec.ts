import { test, expect } from '../../../fixtures/test-setup';
import { DataGenerators } from '../../../utils/generators/data-generators';
import { productCreateResponse } from '../../../fixtures/api-clients/b2b-dml-client';
import { simpleRetry } from '../../../utils/retry-utils';
import { SuccessResponse } from '../../../fixtures/api-clients/b2c-api-client';
import { PRODUCTS_ENDPOINTS } from '../../../data/constants/index';

test.describe('E2E: Product Creation Flow', () => {
  test('create product and verify all values on /screen/product-info', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    // ========== 2. ПРОВЕРЯЕМ /screen/product-info С PRODUCT-ID ==========
    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-id': 'clothing',
    } as any;

    const infoResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.INFO, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const infoResponseData = infoResponse.data;
    // @ts-ignore
    expect(infoResponseData.productNameSection.value).toBe(product.title);
    // @ts-ignore
    expect(infoResponseData.productInfoSection.brand.value).toBe('BURBERRY');
    // @ts-ignore
    expect(infoResponseData.productInfoSection.size.value).toContain('48');
    // @ts-ignore
    expect(infoResponseData.productInfoSection.material.value).toBe('шелк');
    // @ts-ignore
    expect(infoResponseData.productInfoSection.color.value).toBe('белый');

    // @ts-ignore
    expect(infoResponseData.productDetailsSection.model.value).toBe(product.attributes.model);
    // @ts-ignore
    expect(infoResponseData.productDetailsSection.year.value).toBe(product.attributes.year);
    // @ts-ignore
    expect(infoResponseData.productDetailsSection.completeSetItems.value).toBe('пыльник,коробка,карточка');

    // @ts-ignore
    const selectedCondition = infoResponseData.condition.find((c: any) => c.selected === true);
    expect(selectedCondition.id).toBe(product.attributes.condition.id);

    // @ts-ignore
    expect(infoResponseData.renovationToggle.value).toBe(product.attributes.renovationToggle);
    // @ts-ignore
    expect(infoResponseData.rariryToggle.value).toBe(product.attributes.rarityToggle);

    const deleteHeaders = {
      ...headers,
      'product-id': productId,
    } as any;
    const deleteResponse = await simpleRetry(
      async () => {
        const response = await b2bDmlClient.post(PRODUCTS_ENDPOINTS.DML.DELETE, {
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

  test('create product and verify all values on /screen/brands', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);

    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
    } as any;

    const brandResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.BRANDS, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const brandResponseData = brandResponse.data;
    const brandResponseDataStatus = brandResponse.status;
    expect(brandResponseDataStatus).toBe(200);

    let burberryBrand = null as any;

    // @ts-ignore
    for (const section of brandResponseData.brandSections) {
      const found = section.brands.find((b: any) => b.id === 'burberry');
      if (found) {
        burberryBrand = found;
        break;
      }
    }

    expect(burberryBrand).toBeDefined();
    expect(burberryBrand.selected).toBe(true);
    expect(burberryBrand.name).toBe('BURBERRY');
    const deleteHeaders = {
      ...headers,
      'product-id': productId,
    } as any;
    const deleteResponse = await simpleRetry(
      async () => {
        const response = await b2bDmlClient.post(PRODUCTS_ENDPOINTS.DML.DELETE, {
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
  test('create product and verify all values on /screen/size', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const sizeResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.SIZE, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const sizeResponseData = sizeResponse.data;
    const sizeResponseDataStatus = sizeResponse.status;
    expect(sizeResponseDataStatus).toBe(200);

    // @ts-ignore
    const ruLocale = sizeResponseData.localeSection.find((l: any) => l.countryCode === 'RU');
    expect(ruLocale.selected).toBe(true);

    const ruSize48 = ruLocale.sizesTable.find((s: any) => s.id === 'ru-48');
    expect(ruSize48.selected).toBe(true);

    //  Проверяю что другие размеры в RU не выбраны
    const selectedInRU = ruLocale.sizesTable.filter((s: any) => s.selected === true);
    expect(selectedInRU.length).toBe(1); // Только наш размер

    // @ts-ignore
    const exactOpt = sizeResponseData.sizeOptSection.opt.find((o: any) => o.id === 'exact');
    expect(exactOpt.selected).toBe(true);

    // Проверяю что другие опции не выбраны
    // @ts-ignore
    const selectedOpts = sizeResponseData.sizeOptSection.opt.filter((o: any) => o.selected === true);
    expect(selectedOpts.length).toBe(1);

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
  test('create product and verify all values on /screen/material', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const materialResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.MATERIAL, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const materialResponseData = materialResponse.data;
    const materialResponseDataStatus = materialResponse.status;
    expect(materialResponseDataStatus).toBe(200);

    expect(materialResponseData.title).toBe('Выберите материал');

    // Проверяю что мой материал (silk) выбран
    // @ts-ignore
    const selectedMaterial = materialResponseData.materials.find((m: any) => m.selected === true);

    expect(selectedMaterial).toBeDefined();
    expect(selectedMaterial.id).toBe('silk');
    expect(selectedMaterial.name).toBe('Шелк');

    //  Проверяю что другие материалы не выбраны
    // @ts-ignore
    const selectedCount = materialResponseData.materials.filter((m: any) => m.selected === true).length;
    expect(selectedCount).toBe(1);

    //Проверяю что не пустой массив
    // @ts-ignore
    expect(materialResponseData.materials.length).toBeGreaterThan(0);

    // Проверяем кнопку
    expect(materialResponseData.primaryButton.title).toBe('Продолжить');

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

  test('create product and verify all values on /screen/color', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const colorResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.COLOR, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const colorResponseData = colorResponse.data;
    const colorResponseDataStatus = colorResponse.status;
    expect(colorResponseDataStatus).toBe(200);

    expect(colorResponseData.title).toBe('Выберите цвет');

    // Проверяю что наш цвет (black) выбран
    // @ts-ignore
    const selectedColor = colorResponseData.colors.find((c: any) => c.selected === true);

    expect(selectedColor).toBeDefined();
    expect(selectedColor.id).toBe('white');
    expect(selectedColor.name).toBe('Белый');

    // Проверяю что другие цвета не выбраны
    // @ts-ignore
    const selectedCount = colorResponseData.colors.filter((c: any) => c.selected === true).length;
    expect(selectedCount).toBe(1);

    //Проверяю что у цвета есть все поля
    expect(selectedColor.iconName).toBe('white-circle');
    expect(selectedColor.color).toBe('#FFFFFF');

    //  (не пустой массив)
    // @ts-ignore
    expect(colorResponseData.colors.length).toBeGreaterThan(0);

    expect(colorResponseData.primaryButton.title).toBe('Продолжить');

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
  test('create product and verify all values on /screen/complete-set', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const completeSetResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.COMPLETE_SET, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const completeSetResponseData = completeSetResponse.data;
    const completeSetResponseStatus = completeSetResponse.status;
    expect(completeSetResponseStatus).toBe(200);

    // Проверяем структуру
    expect(completeSetResponseData.title).toBe('Комплектация');
    expect(completeSetResponseData.primaryButton.title).toBe('Продолжить');

    // Проверяем каждый элемент
    // @ts-ignore
    const dust = completeSetResponseData.completeSetItems.find((i: any) => i.id === 'dust');
    expect(dust.name).toBe('Пыльник');
    expect(dust.selected).toBe(true);
    // @ts-ignore
    const box = completeSetResponseData.completeSetItems.find((i: any) => i.id === 'box');
    expect(box.name).toBe('Коробка');
    expect(box.selected).toBe(true);
    // @ts-ignore
    const label = completeSetResponseData.completeSetItems.find((i: any) => i.id === 'label');
    expect(label.name).toBe('Карточка');
    expect(label.selected).toBe(true);

    // Проверяем количество выбранных
    // @ts-ignore
    const selectedCount = completeSetResponseData.completeSetItems.filter((i: any) => i.selected).length;
    expect(selectedCount).toBe(3);

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
  test('create product and verify all values on /screen/usage-traces', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();
    const productWithTraces = {
      ...product,
      attributes: {
        ...product.attributes,
        condition: { id: 'with_history' },
        usageTraces: [
          {
            id: 'stains',
          },
          {
            id: 'tears',
          },
          {
            id: 'fading',
          },
          {
            id: 'scratches',
          },
        ],
      },
    };

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: productWithTraces });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const usageTracesResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.USAGE_TRACES, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const usageTracesResponseResponseData = usageTracesResponse.data;
    const usageTracesResponseStatus = usageTracesResponse.status;
    expect(usageTracesResponseStatus).toBe(200);

    // Проверяем структуру
    expect(usageTracesResponseResponseData.title).toBe('Следы использования');
    expect(usageTracesResponseResponseData.primaryButton.title).toBe('Продолжить');

    // Список айдишников
    const expectedIds = ['scratches', 'stains', 'tears', 'fading'];

    expectedIds.forEach((id) => {
      // @ts-ignore
      const item = usageTracesResponseResponseData.usageTraces.find((t: any) => t.id === id);
      expect(item).toBeDefined();
      expect(item.selected).toBe(true);
    });
    //  Проверяем что других выбранных нет (опционально)
    // @ts-ignore
    const selectedItems = usageTracesResponseResponseData.usageTraces.filter((t: any) => t.selected === true);
    expect(selectedItems.length).toBe(expectedIds.length);

    // Проверяю кнопку
    expect(usageTracesResponseResponseData.primaryButton.title).toBe('Продолжить');

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

  test('create product and verify all values on /screen/product-images, with history & new', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const productNew = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: productNew });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const productImagesResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.IMAGES, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const productImagesResponseData = productImagesResponse.data;
    const productImagesResponseStatus = productImagesResponse.status;
    expect(productImagesResponseStatus).toBe(200);

    // Проверяем структуру
    // @ts-ignore
    expect(productImagesResponseData.photoSections.length).toBe(3);

    // Проверяем типы секций
    // @ts-ignore
    const sectionTypes = productImagesResponseData.photoSections.map((s: any) => s.type);
    expect(sectionTypes).toContain('cover');
    expect(sectionTypes).toContain('photo');
    expect(sectionTypes).toContain('label');
    expect(sectionTypes).not.toContain('defect'); // НЕТ секции дефектов

    const historyProduct = DataGenerators.generateMockMenProduct();
    const customProduct = {
      ...historyProduct,
      attributes: {
        ...historyProduct.attributes,
        condition: { id: 'with_history' },
      },
    };

    const historyResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: customProduct });

    expect(historyResponse.status).toBe(201);
    const historyProductId = historyResponse.data.productId;
    // Проверяем экран фото для WITH HISTORY
    const historyImagesResponse = await apiClient.get(PRODUCTS_ENDPOINTS.SCREEN.IMAGES, {
      headers: { ...headers, 'product-id': String(historyProductId) },
    });

    expect(historyImagesResponse.status).toBe(200);
    const historyData = historyImagesResponse.data;

    // Проверяем что секций фото - 4 залетела новая
    // @ts-ignore
    expect(historyData.photoSections.length).toBe(4);

    // Проверяем типы секций
    // @ts-ignore
    const historySectionTypes = historyData.photoSections.map((s: any) => s.type);
    expect(historySectionTypes).toContain('cover');
    expect(historySectionTypes).toContain('photo');
    expect(historySectionTypes).toContain('label');
    expect(historySectionTypes).toContain('defect'); //  секция дефектов

    // @ts-ignore
    const defectSection = historyData.photoSections.find((s: any) => s.type === 'defect');
    expect(defectSection.title).toBe('Фото дефектов');
    expect(defectSection.photosMaxCount).toBe(8);
    expect(defectSection.description).toBe('Нажмите, чтобы загрузить фото бирки');

    const deleteHistoryHeaders = {
      ...headers,
      'product-id': historyProductId,
    };

    const historyDeleteResponse = await simpleRetry(
      async () => {
        const response = await b2bDmlClient.post(PRODUCTS_ENDPOINTS.DML.DELETE, {
          // @ts-ignore
          headers: deleteHistoryHeaders,
        });
        if (response.status !== 201) {
          throw new Error(`Expected status 201, got ${response.status}`);
        }
        return response;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Delete product ${historyProductId}`,
      },
    );
    const historyDeleteResponseData = historyDeleteResponse.data;

    // @ts-ignore
    expect(historyDeleteResponseData.success).toBe(true);
    // @ts-ignore
    expect(historyDeleteResponseData.message).toBe('Данные удалены');
    // @ts-ignore
    expect(historyDeleteResponseData.closeButton).toBe(true);

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

  test('create product and verify all values on /screen/description', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const productDescriptionResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.DESCRIPTION, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const productDescriptionResponseData = productDescriptionResponse.data;
    const productDescriptionResponseStatus = productDescriptionResponse.status;
    expect(productDescriptionResponseStatus).toBe(200);

    // @ts-ignore
    expect(productDescriptionResponseData.descriptionSection.title).toBe('Описание');
    // @ts-ignore
    expect(productDescriptionResponseData.descriptionSection.textMaxCount).toBe(500);
    // @ts-ignore
    expect(productDescriptionResponseData.descriptionSection.textMinCount).toBe(0);
    // @ts-ignore
    expect(productDescriptionResponseData.descriptionSection.placeholder).toBe('Добавьте описание к вашему товару');
    // @ts-ignore
    expect(productDescriptionResponseData.descriptionSection.value).toBe('Стильное мужское пальто для холодного сезона');

    expect(productDescriptionResponseData.primaryButton.title).toBe('Далее');
    expect(productDescriptionResponseData.primaryButton.deeplink).toMatch(/^presale-app:\/\//);
    // @ts-ignore
    expect(productDescriptionResponseData.saveButton.title).toBe('Сохранить');
    // @ts-ignore
    expect(productDescriptionResponseData.saveButton.deeplink).toBe('');

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

  test('create product and verify all values on /screen/product-list', async ({ b2bDmlClient, apiClient, testUser, authContext }) => {
    const product = DataGenerators.generateMockMenProduct();

    const headers = authContext.getDefaultHeaders(testUser);
    // Создаем продукт
    const createResponse = await b2bDmlClient.post<productCreateResponse>(PRODUCTS_ENDPOINTS.DML.CREATE, { headers, data: product });

    expect(createResponse.status).toBe(201);
    const productId = createResponse.data.productId;

    const infoHeaders = {
      ...headers,
      'product-id': productId,
      'category-l1': 'men',
      'category-l2': 'men_clothing',
    } as any;

    const productListResponse = await simpleRetry(
      async () => {
        const resp = await apiClient.get<SuccessResponse>(PRODUCTS_ENDPOINTS.SCREEN.LIST, { headers: infoHeaders });

        if (resp.status !== 200) {
          throw new Error(`Expected status 200, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: `Get product info for ${productId}`,
      },
    );
    const productListResponseData = productListResponse.data;
    const productListResponseStatus = productListResponse.status;
    expect(productListResponseStatus).toBe(200);
    const myProduct = productListResponseData.products.find((p: any) => p.productId === productId);

    expect(myProduct).toBeDefined();
    // @ts-ignore
    expect(myProduct.title).toBe(product.title);
    // @ts-ignore
    expect(myProduct.brand).toBe('BURBERRY');
    // @ts-ignore
    expect(myProduct.progress.value).toBe(100);
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
