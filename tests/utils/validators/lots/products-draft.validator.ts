import { expect } from '@playwright/test';

export class ProductsDraftValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== IMAGE URL ==========
    expect(data.imageUrl).toBeDefined();
    expect(typeof data.imageUrl).toBe('string');
    // может быть пустым, но поле должно быть

    // ========== TITLE ==========
    expect(data.title).toBe('Здесь будут ваши черновики');

    // ========== DESCRIPTION ==========
    expect(data.description).toBe('Сохраняйте незавершенные объявления, чтобы вернуться к ним позже и опубликовать, когда будете готовы.');

    // ========== CREATE LOT BUTTON ==========
    expect(data.createLotButton).toBeDefined();
    expect(data.createLotButton.title).toBe('Создать объявление');

    // Проверка deeplink — должен быть presale deeplink или пустой
    expect(data.createLotButton.deeplink).toBeDefined();
    expect(typeof data.createLotButton.deeplink).toBe('string');

    // Если deeplink не пустой, проверяем что это presale deeplink
    if (data.createLotButton.deeplink.length > 0) {
      expect(data.createLotButton.deeplink).toMatch(/^presale-app:\/\//);
    }
  }
}
