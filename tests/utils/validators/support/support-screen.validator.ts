import { expect } from '@playwright/test';

export class SupportScreenValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Помощь');

    // ========== DESCRIPTION ==========
    expect(data.description).toBe('Мы всегда на связи и готовы решить любой вопрос. Выберите удобный способ связи');

    // ========== CALL BUTTON ==========
    expect(data.callButton).toBeDefined();
    expect(data.callButton.title).toBe('Звонок');

    //  deeplink — это телефонный номер
    expect(data.callButton.deeplink).toMatch(/^tel:\+?\d+$/);

    expect(data.callButton.iconName).toBe('Calling');

    // ========== TELEGRAM BUTTON ==========
    expect(data.telegramButton).toBeDefined();
    expect(data.telegramButton.title).toBe('Телеграм');
    expect(data.telegramButton.deeplink).toMatch(/^https?:\/\/.+/);
    expect(data.telegramButton.iconName).toBe('Tg');
  }
}
