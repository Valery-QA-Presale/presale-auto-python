import { expect } from '@playwright/test';

export class LotsHistoryListValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== LOTS ARRAY ==========
    expect(Array.isArray(data.lots)).toBe(true);
    expect(data.lots.length).toBeGreaterThan(0); // непустой список

    // Проверяем каждый лот
    data.lots.forEach((lot: any, index: number) => {
      // ========== LOT ID ==========
      expect(lot.lotId).toBeDefined();
      expect(typeof lot.lotId).toBe('string');
      expect(lot.lotId.length).toBeGreaterThan(0);

      // ========== STATUS ==========
      expect(lot.status).toBeDefined();
      expect(lot.status.title).toBeDefined();
      expect(typeof lot.status.title).toBe('string');
      expect(lot.status.title.length).toBeGreaterThan(0);

      expect(lot.status.color).toBeDefined();
      expect(typeof lot.status.color).toBe('string');

      // iconName может быть пустым, но поле должно быть
      expect(lot.status.iconName).toBeDefined();
      expect(typeof lot.status.iconName).toBe('string');

      // ========== IMAGE URL ==========
      expect(lot.imageUrl).toBeDefined();
      expect(typeof lot.imageUrl).toBe('string');
      // может быть пустым

      // ========== UPDATED AT ==========
      expect(lot.updatedAt).toBeDefined();
      expect(typeof lot.updatedAt).toBe('string');
      // Проверка что это валидная ISO дата
      expect(lot.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // ========== VIEWS ==========
      expect(lot.views).toBeDefined();
      expect(typeof lot.views).toBe('number');
      expect(lot.views).toBeGreaterThanOrEqual(0);

      expect(lot.viewsIconName).toBe('eye-open');

      // ========== FAVORITES ==========
      expect(lot.addToFavorites).toBeDefined();
      expect(typeof lot.addToFavorites).toBe('number');
      expect(lot.addToFavorites).toBeGreaterThanOrEqual(0);

      expect(lot.favoritesIconName).toBe('heart');

      // ========== BRAND ==========
      expect(lot.brand).toBeDefined();
      expect(typeof lot.brand).toBe('string');
      expect(lot.brand.length).toBeGreaterThan(0);

      // ========== CONDITION ==========
      expect(lot.condition).toBeDefined();
      expect(typeof lot.condition).toBe('string');
      expect(lot.condition.length).toBeGreaterThan(0);

      // ========== SIZE VALUE ==========
      expect(lot.sizeValue).toBeDefined();
      expect(typeof lot.sizeValue).toBe('string');
      expect(lot.sizeValue.length).toBeGreaterThan(0);

      // ========== TITLE ==========
      expect(lot.title).toBeDefined();
      expect(typeof lot.title).toBe('string');
      expect(lot.title.length).toBeGreaterThan(0);

      // ========== PRODUCT PRICE ==========
      expect(lot.productPrice).toBeDefined();
      expect(typeof lot.productPrice).toBe('string');
      expect(lot.productPrice).toMatch(/^\d+ ₽$/); // формат "85000 ₽"
    });

    // ========== PAGINATION ==========
    expect(data.pagination).toBeDefined();

    expect(data.pagination.limit).toBeDefined();
    expect(typeof data.pagination.limit).toBe('number');
    expect(data.pagination.limit).toBeGreaterThan(0);

    expect(data.pagination.offset).toBeDefined();
    expect(typeof data.pagination.offset).toBe('number');
    expect(data.pagination.offset).toBeGreaterThanOrEqual(0);

    expect(data.pagination.total).toBeDefined();
    expect(typeof data.pagination.total).toBe('number');
    expect(data.pagination.total).toBeGreaterThanOrEqual(0);

    // Логическая проверка: total должно быть >= количества лотов
    expect(data.pagination.total).toBeGreaterThanOrEqual(data.lots.length);
  }
}
