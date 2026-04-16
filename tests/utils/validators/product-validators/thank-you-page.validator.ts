import { expect } from '@playwright/test';

export class ThankYouPageValidator {
  static validate(data: any): void {
    // Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Спасибо');
    expect(data.subTitle).toBe('Ваша заявка на модерации');
    expect(data.description).toBe('После проверки объявление автоматически будет размещено на платформе — обычно это занимает немного времени.');

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('К объявлениям');
    expect(data.primaryButton.deeplink).toBe('');
  }
}
