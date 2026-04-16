import { expect } from '@playwright/test';

export class AddressFormValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Введите адрес');

    // ========== ADDRESS FIELD ==========
    expect(data.address).toBeDefined();
    expect(data.address.placeholder).toBe('');
    expect(data.address.label).toBe('Адрес');
    expect(data.address.value).toBe('');
    expect(Array.isArray(data.address.validate)).toBe(true);

    // ========== PRIVATE PROPERTY ==========
    expect(data.privateProperty).toBeDefined();
    expect(typeof data.privateProperty.isPrivateProperty).toBe('boolean');
    expect(data.privateProperty.title).toBe('Частный дом');

    // ========== APARTMENT ==========
    expect(data.apartment).toBeDefined();
    expect(data.apartment.placeholder).toBe('');
    expect(data.apartment.label).toBe('Квартира');
    expect(data.apartment.value).toBe('');
    expect(Array.isArray(data.apartment.validate)).toBe(true);

    // ========== DOORPHONE ==========
    expect(data.doorphone).toBeDefined();
    expect(data.doorphone.placeholder).toBe('');
    expect(data.doorphone.label).toBe('Домофон');
    expect(data.doorphone.value).toBe('');
    expect(Array.isArray(data.doorphone.validate)).toBe(true);

    // ========== ENTRANCE ==========
    expect(data.entrance).toBeDefined();
    expect(data.entrance.placeholder).toBe('');
    expect(data.entrance.label).toBe('Подъезд');
    expect(data.entrance.value).toBe('');
    expect(Array.isArray(data.entrance.validate)).toBe(true);

    // ========== FLOOR ==========
    expect(data.floor).toBeDefined();
    expect(data.floor.placeholder).toBe('');
    expect(data.floor.label).toBe('Этаж');
    expect(data.floor.value).toBe('');
    expect(Array.isArray(data.floor.validate)).toBe(true);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton).toBeDefined();
    expect(data.primaryButton.title).toBe('Сохранить');
    expect(data.primaryButton.deeplink).toBe('');
    expect(data.primaryButton.iconName).toBe('');
  }
}
