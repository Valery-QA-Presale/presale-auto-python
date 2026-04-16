import { test, expect } from '../../../../fixtures/test-setup';
import { TestDataGenerator } from '../../../../data/test-data';
import { SuccessResponse } from '../../../../fixtures/api-clients/b2c-api-client';
import { simpleRetry, waitForCondition } from '../../../../utils/retry-utils';

const sharedState = {
  createdAddressId: null as string | null,
};

test.describe.configure({ mode: 'serial' });

test.describe('Address CRUD Flow ', () => {
  test('Create new address', async ({ apiClient, testUser, authContext }) => {
    const addressData = TestDataGenerator.generateAddress();

    const headers = authContext.getDefaultHeaders(testUser);
    const requestOptions = { headers: headers, data: addressData };

    const response = await simpleRetry(
      async () => {
        const resp = await apiClient.post<SuccessResponse>('/profile/address-create', requestOptions);
        if (resp.status !== 201) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: 'Update address API',
      },
    );
    const responseStatus = response.status;
    const responseData = response.data;

    expect(responseStatus).toBe(201);
    expect(responseData).toHaveProperty('addressId');
    expect(responseData).toHaveProperty('success', true);

    expect(responseData.banner).toHaveProperty('message', 'Данные сохранены');
    //Сохраняем адрес в глобалдьный контекст
    sharedState.createdAddressId = responseData.addressId;
  });

  test('Get  created address', async ({ apiClient, testUser, authContext }) => {
    if (!sharedState.createdAddressId) {
      throw new Error('FAILED: createdAddressId is null! Run creation test first.');
    }

    const currentAddressId = sharedState.createdAddressId;

    const headers = authContext.getDefaultHeaders(testUser);
    const requestOptions = { headers: headers };

    const response = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', requestOptions);
    const responseStatus = response.status;
    const responseData = response.data;

    expect(responseStatus).toBe(200);
    expect(responseData).toHaveProperty('addresses');
    expect(responseData).toHaveProperty('title', 'Мои адреса'); // Доп проверка
    expect(Array.isArray(response.data.addresses)).toBe(true);

    //  ищем  наш обновлённый адрес по addressId
    // @ts-ignore
    const createdAddress = responseData.addresses.find((addr: any) => addr.addressId === currentAddressId);
    // проверка что новый адрес найден
    expect(createdAddress).toBeDefined();
    expect(createdAddress).not.toBeNull();
  });

  test('Update created address with simple retry logic', async ({ apiClient, testUser, authContext }) => {
    if (!sharedState.createdAddressId) {
      throw new Error('No addressId to update!');
    }
    const currentAddressId = sharedState.createdAddressId;

    const updatedData = {
      ...TestDataGenerator.generateAddress(),
      address: 'ул. Обновленная, д. 99',
    };

    const headers = authContext.getDefaultHeaders(testUser);
    const verifyHeaders = { ...headers, 'address-Id': currentAddressId };
    const requestOptions = { headers: verifyHeaders, data: updatedData };

    // ==================== ШАГ 1: Обновление адреса с простым ретраем ====================

    // Простой ретрай вместо retryApiCall
    const response = await simpleRetry(
      async () => {
        const resp = await apiClient.post<SuccessResponse>('/profile/address-update', requestOptions);
        if (resp.status !== 201) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: 'Update address API',
      },
    );

    // Проверяем ответ
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('success', true);
    expect(response.data.banner).toHaveProperty('message', 'Данные обновлены');

    // ==================== ШАГ 2: Ждём обновления с умным ожиданием ====================

    // Простой waitForCondition без лишних опций
    await waitForCondition(
      async () => {
        const getResponse = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', { headers });

        if (getResponse.status !== 200) return false;
        // @ts-ignore
        const updatedAddress = getResponse.data.addresses?.find((addr: any) => addr.addressId === currentAddressId);

        if (!updatedAddress) return false;

        const expectedValue = `${updatedData.address}, кв. ${updatedData.apartment}`;
        return updatedAddress.value === expectedValue;
      },
      {
        timeout: 10000,
        interval: 500,
        description: `Address ${currentAddressId} update propagation`,
      },
    );

    // ==================== ШАГ 3: Финальная проверка ====================

    // Получаем финальный список адресов
    const getResponse = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', { headers });

    expect(getResponse.status).toBe(200);
    expect(getResponse.data).toHaveProperty('addresses');
    expect(Array.isArray(getResponse.data.addresses)).toBe(true);
    // @ts-ignore
    const updatedAddress = getResponse.data.addresses.find((addr: any) => addr.addressId === currentAddressId);

    expect(updatedAddress).toBeDefined();

    const expectedValue = `${updatedData.address}, кв. ${updatedData.apartment}`;
    expect(updatedAddress.value).toBe(expectedValue);
  });
  test('Make as default created address', async ({ apiClient, testUser, authContext }) => {
    if (!sharedState.createdAddressId) {
      throw new Error('No addressId to make default!');
    }
    const currentAddressId = sharedState.createdAddressId;

    const addressData = TestDataGenerator.generateAddress();
    const headers = authContext.getDefaultHeaders(testUser);
    const verifyHeaders = { ...headers, 'address-Id': currentAddressId };
    const requestOptions = { headers: verifyHeaders, data: addressData };

    // ==================== ШАГ 1: Сделать адрес дефолтным ====================

    const response = await simpleRetry(() => apiClient.post<SuccessResponse>('/profile/address-make-default', requestOptions), {
      maxAttempts: 3,
      delay: 1000,
      description: 'Update address API',
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('success', true);
    expect(response.data.banner).toHaveProperty('message', 'Данные обновлены');

    // ==================== ШАГ 2: Ждём и получаем результат за один раз ====================

    // Переменные для сохранения результатов
    let finalGetResponse: any = null;
    let finalUpdatedAddress: any = null;

    await waitForCondition(
      async () => {
        try {
          // Запрашиваем список адресов ОДИН раз
          const getResponse = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', { headers });

          if (getResponse.status !== 200) {
            console.log(`⚠️ GET addresses status: ${getResponse.status}`);
            return false;
          }

          // Ищем наш адрес
          // @ts-ignore
          const updatedAddress = getResponse.data.addresses?.find((addr: any) => addr.addressId === currentAddressId);

          // Если адрес не найден
          if (!updatedAddress) {
            console.log(`⏳ Address ${currentAddressId} not found in list`);
            return false;
          }

          // Проверяем флаг isDefault
          if (updatedAddress.isDefault !== true) {
            console.log(`⏳ Address ${currentAddressId} isDefault = ${updatedAddress.isDefault}, waiting...`);
            return false;
          }

          // Дополнительно: проверяем что только ОДИН адрес дефолтный
          // @ts-ignore
          const defaultAddresses = getResponse.data.addresses?.filter((addr: any) => addr.isDefault === true);

          if (defaultAddresses && defaultAddresses.length !== 1) {
            console.log(`⚠️ Found ${defaultAddresses.length} default addresses, expected 1`);
            return false;
          }

          // СОХРАНЯЕМ РЕЗУЛЬТАТЫ для использования после waitForCondition
          finalGetResponse = getResponse;
          finalUpdatedAddress = updatedAddress;

          console.log(`✅ Address ${currentAddressId} is now default`);
          return true;
        } catch (error) {
          console.log(`⚠️ Error checking default status: ${error.message}`);
          return false;
        }
      },
      {
        timeout: 10000,
        interval: 500,
        // @ts-ignore
        message: `Address ${currentAddressId} did not become default within timeout`,
        onPoll: (attempt, elapsed) => {},
      },
    );

    // ==================== ШАГ 3: Проверяем сохранённые результаты ====================

    // Теперь используем сохранённые данные, а не делаем новый запрос
    expect(finalGetResponse).not.toBeNull();
    expect(finalGetResponse.status).toBe(200);
    expect(finalGetResponse.data).toHaveProperty('addresses');

    expect(finalUpdatedAddress).toBeDefined();
    expect(finalUpdatedAddress.isDefault).toBe(true);

    // Дополнительная проверка: только один дефолтный адрес
    const defaultAddresses = finalGetResponse.data.addresses.filter((addr: any) => addr.isDefault === true);
    expect(defaultAddresses).toHaveLength(1);
    expect(defaultAddresses[0].addressId).toBe(currentAddressId);
  });

  test('Delete created address', async ({ apiClient, testUser, authContext }) => {
    if (!sharedState.createdAddressId) {
      throw new Error('No addressId to delete!');
    }

    const addressData = TestDataGenerator.generateAddress();

    const currentAddressId = sharedState.createdAddressId;
    const headers = authContext.getDefaultHeaders(testUser);
    // Проверка адреса перед удалением
    const initialResponse = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', { headers });
    // @ts-ignore
    const addressExistsBefore = initialResponse.data.addresses.some((addr: any) => addr.addressId === currentAddressId);
    expect(addressExistsBefore).toBe(true);

    const verifyHeaders = { ...headers, 'address-Id': currentAddressId };
    const requestOptions = { headers: verifyHeaders, data: addressData };

    //  Удаление адреса с ретраем
    const deleteResponse = await simpleRetry(
      async () => {
        const response = await apiClient.post<SuccessResponse>('/profile/address-delete', requestOptions);

        // Проверяем статус внутри ретрая
        if (response.status !== 201) {
          throw new Error(`Expected 201, got ${response.status}`);
        }

        if (!response.data.success) {
          throw new Error('Delete operation failed (success: false)');
        }

        return response;
      },
      {
        maxAttempts: 3,
        delay: 1000,
        description: 'Delete address API',
      },
    );

    const deleteResponseStatus = deleteResponse.status;
    const deleteResponseData = deleteResponse.data;

    expect(deleteResponseStatus).toBe(201);
    expect(deleteResponseData).toHaveProperty('success', true);

    if (deleteResponse.data.banner) {
      expect(deleteResponse.data.banner).toHaveProperty('message', 'Данные удалены');
    }

    // Вместо setTimeout(300) используем умное ожидание
    await waitForCondition(
      async () => {
        try {
          const checkResponse = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', { headers });

          if (checkResponse.status !== 200) return false;

          // Ищем адрес - его не должно быть
          // @ts-ignore
          const addressStillExists = checkResponse.data.addresses.some((addr: any) => addr.addressId === currentAddressId);

          return !addressStillExists; // Успех когда адрес НЕ найден
        } catch (error) {
          return false;
        }
      },
      {
        timeout: 10000, // Ждём до 10 секунд
        interval: 500, // Проверяем каждые 500мс
        description: `Address ${currentAddressId} deletion`,
      },
    );

    const finalResponse = await apiClient.get<SuccessResponse>('/screen/profile/addresses-list', requestOptions);
    const finalResponseStatus = finalResponse.status;
    const finalResponseData = finalResponse.data;

    expect(finalResponseStatus).toBe(200);
    expect(Array.isArray(finalResponseData.addresses)).toBe(true);
    // проверяю что длина массива уменьшилась
    expect(finalResponse.data.addresses.length).toBe(initialResponse.data.addresses.length - 1);
    //  ищем  наш удаленный адрес всписке по addressId
    // @ts-ignore
    const deletedAddress = finalResponseData.addresses.find((addr: any) => addr.addressId === currentAddressId);
    // проверяю что адреса больше нет
    expect(deletedAddress).toBeUndefined();
    expect(deletedAddress).toBeFalsy();
  });
});
