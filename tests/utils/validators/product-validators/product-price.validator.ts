import { expect } from '@playwright/test';

export class ProductPriceValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    expect(data.title).toBe('Цена');
    expect(data.value).toBe(0);
    expect(data.placeholder).toBe('Цена объявления, ₽');

    expect(data.description).toContain('комиссию сервиса');
    expect(data.description).toContain('10% до 22%');
    expect(data.description).toContain('15 000 ₽');
    expect(data.description).toContain('3 000 ₽');

    expect(data.profitSection.title).toBe('Вы получите');
    expect(data.profitSection.color).toBe('accent');
    expect(data.profitSection.revenue).toBe(0);

    expect(data.acceptButton.title).toContain('Соглашаюсь с');
    expect(data.acceptButton.title).toContain('условиями оферты');
    expect(data.acceptButton.deeplink).toBe('');

    expect(data.validateSection.minPrice).toBe(5000);
    expect(data.validateSection.title).toBe('Минимальная цена - 5 000 ₽');
    expect(data.validateSection.color).toBe('error');

    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toMatch(/^presale-app:\/\//);
    expect(data.primaryButton.deeplink.length).toBeGreaterThan(0);

    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toBe('');
  }
}
