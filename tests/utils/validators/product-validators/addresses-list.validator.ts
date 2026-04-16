import { expect } from '@playwright/test';

export class AddressesListValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Выберите адрес');
    expect(data.subTitle).toBe('Нам нужно знать откуда забрать товар в случае его покупки');

    // ========== ADDRESSES ==========
    expect(Array.isArray(data.addresses)).toBe(true);
    expect(data.addresses.length).toBeGreaterThanOrEqual(1);

    // Проверяем каждый адрес
    data.addresses.forEach((address: any, index: number) => {
      // Проверка формата addressId (ULID - 26 символов, заглавные буквы и цифры)
      expect(address.addressId).toMatch(/^[A-Z0-9]{26}$/);

      expect(address.title).toBe('Адрес получения товара');
      expect(address.iconName).toBe('location');

      // value не должен быть пустым
      expect(address.value).toBeDefined();
      expect(typeof address.value).toBe('string');
      expect(address.value.length).toBeGreaterThan(0);

      // isDefault должен быть boolean
      expect(typeof address.isDefault).toBe('boolean');

      // Логируем адреса для отладки
    });

    // Проверка уникальности addressId
    const addressIds = data.addresses.map((a: any) => a.addressId);
    const uniqueIds = new Set(addressIds);
    expect(addressIds.length).toBe(uniqueIds.size);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('presale-app://app/sale-advert-tab/sale-advert-price');
    expect(data.primaryButton.deeplink).toMatch(/^presale-app:\/\//);

    // ========== ADD ADDRESS BUTTON ==========
    expect(data.addAddressButton.title).toBe('Добавить новый');
    expect(data.addAddressButton.deeplink).toBe('presale-app://app/profile/add-address');
    expect(data.addAddressButton.deeplink).toMatch(/^presale-app:\/\//);

    // ========== SAVE BUTTON ==========
    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toBe('');
  }
}
