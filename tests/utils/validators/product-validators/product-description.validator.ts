import { expect } from '@playwright/test';

export class ProductDescriptionValidator {
  static validate(data: any): void {
    // Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== DESCRIPTION SECTION ==========
    const descSection = data.descriptionSection;

    expect(descSection.title).toBe('Описание');
    expect(descSection.textMaxCount).toBe(500);
    expect(descSection.textMinCount).toBe(0);
    expect(descSection.placeholder).toBe('Добавьте описание к вашему товару');
    expect(descSection.value).toBe('');

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Далее');
    expect(data.primaryButton.deeplink).toBe('presale-app://app/sale-advert-tab/sale-address-select');
    expect(data.primaryButton.deeplink).toMatch(/^presale-app:\/\//);

    // ========== SAVE BUTTON ==========
    expect(data.saveButton.title).toBe('Сохранить');
    expect(data.saveButton.deeplink).toBe('');
  }
}
