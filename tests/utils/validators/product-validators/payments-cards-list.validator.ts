import { expect } from '@playwright/test';

export class PaymentsCardsListValidator {
  static validate(data: any): void {
    // Корневые проверки
    this.validateRootFields(data);

    // Проверка карт
    this.validateCards(data.cards);

    // Проверка секции добавления
    this.validateAddSection(data.cartAddSection);

    // Проверка кнопок
    this.validateButtons(data);
  }

  private static validateRootFields(data: any): void {
    expect(data.title).toBe('Выберите карту');
    expect(data.description).toBe('Нам нужно знать куда отправлять вам деньги за продажу товара');

    // Проверка поддержки (опционально)
    if (data.support) {
      expect(data.support).toMatch(/\[.+\]\(.+\)/);
    }
  }

  private static validateCards(cards: any[]): void {
    expect(Array.isArray(cards)).toBe(true);

    // Проверяем каждую карту если они есть
    cards.forEach((card, index) => {
      console.log(`💳 Card ${index + 1}:`, card.cardId);

      expect(card.cardId).toBeDefined();
      expect(card.cardId).toBeTruthy();

      expect(card.title).toBe('Банковская карта');

      expect(card.bankName).toBeDefined();
      expect(card.bankName.length).toBeGreaterThan(0);

      expect(card.cardNumber).toMatch(/^\*\d{4}$/);

      expect(card.iconName).toBeDefined();
      expect(card.iconName.length).toBeGreaterThan(0);

      expect(typeof card.isDefault).toBe('boolean');
    });

    // Проверка что только одна карта может быть isDefault: true
    const defaultCards = cards.filter((c) => c.isDefault === true);
    expect(defaultCards.length).toBeLessThanOrEqual(1);
  }

  private static validateAddSection(section: any): void {
    expect(section).toBeDefined();

    // Card Add Button
    expect(section.cardAddButton.title).toBe('Добавить новую');
    expect(section.cardAddButton.deeplink).toBe('');

    // Main Description
    expect(section.mainDescription.title).toContain('проведем оплату');
    expect(section.mainDescription.title).toContain('небольшую сумму');
    expect(section.mainDescription.title).toContain('вернем');
    expect(section.mainDescription.textColor).toMatch(/^onSurfaceVariant|surfaceVariant$/);

    // Security Description
    expect(section.securityDescription.title).toContain('надежно зашифрованы');
    expect(section.securityDescription.textColor).toMatch(/^success|systemSuccess$/);
    expect(section.securityDescription.iconName).toBe('lock-fill');
  }

  private static validateButtons(data: any): void {
    // Primary Button
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toMatch(/^presale-app:\/\//);
    expect(data.primaryButton.deeplink).toContain('advert-result');

    // Save Button
    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toMatch(/^app:\/\//);
  }
}
