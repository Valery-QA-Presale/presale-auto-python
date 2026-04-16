import { expect } from '@playwright/test';

export class AddressesListValidator {
  static validate(data: any): void {
    this.validateBaseStructure(data);

    if (data.addresses.length === 0) {
      this.validateEmptyState(data);
    } else {
      this.validateWithAddresses(data);
    }
  }

  private static validateBaseStructure(data: any): void {
    // ========== ОСНОВНЫЕ ПОЛЯ ==========
    expect(data.title).toBe('Мои адреса');

    expect(data.screenImageUrl).toBeDefined();
    expect(typeof data.screenImageUrl).toBe('string');

    expect(data.screenMessage).toBeDefined();
    expect(typeof data.screenMessage).toBe('string');

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton).toBeDefined();
    expect(data.primaryButton.title).toBe('Добавить новый');
    expect(data.primaryButton.iconName).toBe('');
    expect(data.primaryButton.deeplink).toBe('');

    // ========== ADDRESSES ==========
    expect(Array.isArray(data.addresses)).toBe(true);
  }

  private static validateEmptyState(data: any): void {
    expect(data.addresses.length).toBe(0);
    expect(data.screenMessage).toBe('У вас пока нет адресов');
  }

  private static validateWithAddresses(data: any): void {
    expect(data.addresses.length).toBeGreaterThan(0);

    // Проверяем каждый адрес
    data.addresses.forEach((address: any, index: number) => {
      // Проверка addressId (ULID формат)
      expect(address.addressId).toBeDefined();
      expect(typeof address.addressId).toBe('string');
      expect(address.addressId).toMatch(/^[A-Z0-9]{26}$/);

      // Проверка title
      expect(address.title).toBe('Адрес доставки');

      // Проверка iconName
      expect(address.iconName).toBe('location');

      // Проверка value (не пустой)
      expect(address.value).toBeDefined();
      expect(typeof address.value).toBe('string');
      expect(address.value.length).toBeGreaterThan(0);

      // Проверка isDefault (булево)
      expect(typeof address.isDefault).toBe('boolean');
    });

    // Проверка что только один адрес может быть isDefault: true
    const defaultAddresses = data.addresses.filter((a: any) => a.isDefault === true);
    expect(defaultAddresses.length).toBeLessThanOrEqual(1);
  }
}
