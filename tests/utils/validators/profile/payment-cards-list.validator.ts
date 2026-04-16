import { expect } from '@playwright/test';

export class PaymentCardsListValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Мои карты');

    // ========== SCREEN MESSAGE ==========
    expect(data.screenMessage).toBe('Здесь будут ваши карты');

    // ========== SCREEN IMAGE URL ==========
    expect(data.screenImageUrl).toBe('https://ya.ru');

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton).toBeDefined();
    expect(data.primaryButton.title).toBe('Добавить новую');

    // ========== CARDS ==========
    expect(Array.isArray(data.cards)).toBe(true);
    expect(data.cards.length).toBeGreaterThanOrEqual(0);

    // Проверяем каждую карту (если они есть)
    data.cards.forEach((card: any, index: number) => {
      console.log(`💳 Card ${index + 1}:`, card.cardId);

      expect(card.bankname).toBeDefined();
      expect(typeof card.bankname).toBe('string');

      expect(card.cardId).toBeDefined();
      expect(typeof card.cardId).toBe('string');

      expect(card.cardNumber).toBeDefined();
      expect(card.cardNumber).toMatch(/^\*\d{4}$/); // формат *9999

      expect(card.iconName).toBeDefined();
      expect(typeof card.iconName).toBe('string');

      expect(card.title).toBe('Банковская карта');

      expect(card.isDefault).toBeDefined();
      expect(typeof card.isDefault).toBe('boolean');

      // GatewayName может быть пустой строкой
      expect(card.GatewayName).toBeDefined();
      expect(typeof card.GatewayName).toBe('string');
    });

    // Проверка что только одна карта может быть isDefault = true
    const defaultCards = data.cards.filter((card: any) => card.isDefault === true);
    expect(defaultCards.length).toBeLessThanOrEqual(1);
  }
}
