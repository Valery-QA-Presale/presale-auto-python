import { expect } from '@playwright/test';

export class ProductListValidator {
  static validate(data: any, context?: { hasProducts?: boolean }): void {
    //  Проверка в зависимости от контекста
    if (context?.hasProducts) {
      this.validateWithProducts(data);
    } else {
      this.validateEmpty(data);
    }
  }

  private static validateEmpty(data: any): void {
    // Проверяем что массив продуктов пустой
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBe(0);

    // Просто проверяем что объект pagination существует
    expect(data).toHaveProperty('pagination');
  }

  private static validateWithProducts(data: any): void {
    // Проверяем что массив продуктов не пустой
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);

    // Проверяем каждый продукт
    data.products.forEach((product: any, index: number) => {
      // Проверка формата productId (ULID)
      expect(product.productId).toMatch(/^[A-Z0-9]{26}$/);

      // Проверка createdAt (ISO дата)
      expect(product.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);

      // Проверка title (не пустой)
      expect(product.title).toBeTruthy();
      expect(typeof product.title).toBe('string');

      // Проверка progress
      expect(product.progress.title).toMatch(/^Объявление заполнено на \d+%$/);
      //  expect(product.progress.value).toBe(100);

      // Проверка delete button
      expect(product.deleteLotButton.iconName).toBe('trash');
      expect(product.deleteLotButton.deeplink).toBe('');

      // Проверка delete modal
      expect(product.deleteModal.title).toBe('Удалить черновик?');
      expect(product.deleteModal.description).toBe('Тогда вы не сможете вернуться к редактированию объявления');
      expect(product.deleteModal.confirm).toBe('Удалить');
      expect(product.deleteModal.cancel).toBe('Оставить');

      // Проверка brand (может быть пустым)
      expect(typeof product.brand).toBe('string');

      // Проверка imageUrl (может быть пустым)
      expect(typeof product.imageUrl).toBe('string');
    });

    // проверяем что объект pagination существует
    expect(data).toHaveProperty('pagination');
  }
}
