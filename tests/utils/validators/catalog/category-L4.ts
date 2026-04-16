import { expect } from '@playwright/test';

export class CategoryL4Validator {
  static validate(data: any): void {
    expect(data.title).toBe('Верхняя одежда');
    expect(Array.isArray(data.subCategories)).toBe(true);
    expect(data.subCategories.length).toBeGreaterThan(0);

    data.subCategories.forEach((sub: any) => {
      expect(sub.id).toBeDefined();
      expect(typeof sub.id).toBe('string');
      expect(sub.id).toMatch(/^(men|woman)_clothing_clothing-outerwear_coats$/);
      expect(sub.title).toBe('Пальто');
      expect(sub.deeplink).toBeDefined();
      expect(typeof sub.deeplink).toBe('string');
    });

    expect(data.viewAllButton.title).toBe('Смотреть все');
    expect(data.viewAllButton.deeplink).toBeDefined();
    expect(typeof data.viewAllButton.deeplink).toBe('string');
  }
}
