import { test, expect } from '../../../../fixtures/test-setup';
import { ENDPOINTS } from '../../../../data/constants/index';
import { AddressesListValidator } from '../../../../utils/validators/profile/addresses-list.validator';
import { SuccessResponse } from '../../../../fixtures/api-clients/b2c-api-client';
import { AddressFormValidator } from '../../../../utils/validators/profile/address-form.validator';

test.describe('GET /screen/profile/addresses-list - Screen Validation', () => {
  test('should return empty addresses list for new user', async ({ apiClient, freshB2CUser, authContext }) => {
    // использую fresh юзера который точно без адресов
    const headers = authContext.getDefaultHeaders(freshB2CUser);

    const response = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.ADDRESSES_LIST, { headers });

    expect(response.status).toBe(200);

    AddressesListValidator.validate(response.data);

    //  доп проверки от греха подальше
    expect(response.data.addresses).toHaveLength(0);
    expect(response.data.screenMessage).toBe('У вас пока нет адресов');
    expect(response.data.primaryButton.title).toBe('Добавить новый');
  });

  test('should return non-empty addresses list for user with addresses', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.ADDRESSES_LIST, { headers });

    expect(response.status).toBe(200);

    AddressesListValidator.validate(response.data);

    // доп проверки
    expect(response.data.addresses.length).toBeGreaterThan(0);
    expect(response.data.screenMessage).toBe('У вас пока нет адресов'); // даже с адресами сообщение может быть таким же

    //  Проверяем структуру первого адреса для уверенности
    const firstAddress = response.data.addresses[0];
    // @ts-ignore
    expect(firstAddress.addressId).toMatch(/^[A-Z0-9]{26}$/); // ULID формат
    // @ts-ignore
    expect(firstAddress.title).toBe('Адрес доставки');
    // @ts-ignore
    expect(firstAddress.iconName).toBe('location');
    // @ts-ignore
    expect(firstAddress.value).toBeDefined();
    // @ts-ignore
    expect(firstAddress.value.length).toBeGreaterThan(0);
    // @ts-ignore
    expect(typeof firstAddress.isDefault).toBe('boolean');

    // чекаю что все адреса имеют правильную структуру
    // @ts-ignore
    response.data.addresses.forEach((address: any, index: number) => {
      expect(address.addressId).toMatch(/^[A-Z0-9]{26}$/);
      expect(address.title).toBe('Адрес доставки');
      expect(address.iconName).toBe('location');
      expect(address.value.length).toBeGreaterThan(0);
      expect(typeof address.isDefault).toBe('boolean');
    });
  });
});

test.describe('GET /screen/profile/address - Address Form Screen', () => {
  test('should return address form structure for new address', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.ADDRESS, { headers });

    expect(response.status).toBe(200);

    AddressFormValidator.validate(response.data);

    // доп проверки что поля формы пустые
    // @ts-ignore
    expect(response.data.address.value).toBe('');
    // @ts-ignore
    expect(response.data.apartment.value).toBe('');
    // @ts-ignore
    expect(response.data.doorphone.value).toBe('');
    // @ts-ignore
    expect(response.data.entrance.value).toBe('');
    // @ts-ignore
    expect(response.data.floor.value).toBe('');
    // @ts-ignore
    expect(response.data.privateProperty.isPrivateProperty).toBe(false);
  });
});
