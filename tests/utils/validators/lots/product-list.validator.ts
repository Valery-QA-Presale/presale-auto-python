import { expect } from '@playwright/test';

export class ProductListValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== PRODUCTS ARRAY ==========
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThanOrEqual(0);

    // Проверяем каждый продукт
    data.products.forEach((product: any, index: number) => {
      // ========== PRODUCT ID ==========
      expect(product.productId).toBeDefined();
      expect(typeof product.productId).toBe('string');
      expect(product.productId).toMatch(/^[A-Z0-9]{26}$/); // ULID формат

      // ========== IMAGE URL ==========
      expect(product.imageUrl).toBeDefined();
      expect(typeof product.imageUrl).toBe('string');
      // может быть пустым

      // ========== CREATED AT ==========
      expect(product.createdAt).toBeDefined();
      expect(typeof product.createdAt).toBe('string');
      // Проверка что это валидная ISO дата
      expect(product.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // ========== BRAND ==========
      expect(product.brand).toBeDefined();
      expect(typeof product.brand).toBe('string');
      // может быть пустым, но поле должно быть

      // ========== TITLE ==========
      expect(product.title).toBeDefined();
      expect(typeof product.title).toBe('string');
      expect(product.title.length).toBeGreaterThan(0);

      // ========== PROGRESS ==========
      expect(product.progress).toBeDefined();

      expect(product.progress.title).toBeDefined();
      expect(typeof product.progress.title).toBe('string');
      expect(product.progress.title).toMatch(/^Объявление заполнено на \d+%$/); // "Объявление заполнено на 83%"

      expect(product.progress.value).toBeDefined();
      expect(typeof product.progress.value).toBe('number');
      expect(product.progress.value).toBeGreaterThanOrEqual(0);
      expect(product.progress.value).toBeLessThanOrEqual(100);

      // Проверка что value соответствует проценту в title
      const percentFromTitle = parseInt(product.progress.title.match(/\d+/)?.[0] || '0');
      expect(Math.round(product.progress.value)).toBe(percentFromTitle);

      // ========== DELETE LOT BUTTON ==========
      expect(product.deleteLotButton).toBeDefined();
      expect(product.deleteLotButton.iconName).toBe('trash');
      expect(product.deleteLotButton.deeplink).toBeDefined();
      expect(typeof product.deleteLotButton.deeplink).toBe('string');

      // ========== DELETE MODAL ==========
      expect(product.deleteModal).toBeDefined();
      expect(product.deleteModal.title).toBe('Удалить черновик?');
      expect(product.deleteModal.description).toBe('Тогда вы не сможете вернуться к редактированию объявления');
      expect(product.deleteModal.confirm).toBe('Удалить');
      expect(product.deleteModal.cancel).toBe('Оставить');
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

    // Логическая проверка: total должно быть >= количества продуктов
    expect(data.pagination.total).toBeGreaterThanOrEqual(data.products.length);
  }
}
