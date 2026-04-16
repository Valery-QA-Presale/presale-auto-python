import { expect } from '@playwright/test';

export class EmailScreenValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Укажите новую почту');

    // ========== SUBTITLE ==========
    expect(data.subtitle).toBe('Чтобы вы могли получать уведомления, мы отправим письмо с кодом для подтверждения');

    // ========== SUPPORT ==========
    expect(data.support).toBe('[Написать в поддержку](presale-app://app/support)');
    // Можно проверить что это markdown-ссылка
    expect(data.support).toMatch(/^\[.+\]\(.+\)$/);

    // ========== PLACEHOLDER ==========
    expect(data.placeholder).toBe('E-mail');

    // ========== VALIDATE ==========
    expect(Array.isArray(data.validate)).toBe(true);

    // ========== SUBMIT BUTTON ==========
    expect(data.submitButton).toBeDefined();
    expect(data.submitButton.title).toBe('Получить код');

    // ========== CHECKBOX MARKETING ==========
    expect(data.checkboxMarketing).toBeDefined();
    expect(data.checkboxMarketing.title).toBe('Хочу получать рекламные предложения');
    expect(data.checkboxMarketing.checked).toBe(true);
  }
}
