import { expect } from '@playwright/test';

export class CatalogMainMenValidator {
  /**
   * Основной метод валидации
   */
  static validate(data: any): void {
    this.validateRootFields(data);
    this.validateSubCategories(data.subCategories);
    this.validateBrands(data.brands);
    this.validateAllBrandsButton(data.allBrandsButton);
  }

  private static validateRootFields(data: any): void {
    expect(data.categoryId).toBe('men');

    expect(Array.isArray(data.subCategories)).toBe(true);

    expect(Array.isArray(data.brands)).toBe(true);

    expect(data.allBrandsButton).toBeDefined();
    expect(typeof data.allBrandsButton).toBe('object');
  }

  private static validateSubCategories(subCategories: any[]): void {
    expect(subCategories.length).toBeGreaterThan(0);

    subCategories.forEach((sub, index) => {
      expect(sub.id).toBeDefined();
      expect(typeof sub.id).toBe('string');
      expect(sub.id.length).toBeGreaterThan(0);

      expect(sub.title).toBeDefined();
      expect(typeof sub.title).toBe('string');
      expect(sub.title.length).toBeGreaterThan(0);

      // deeplink — может быть пустым
      expect(sub.deeplink).toBeDefined();
      expect(typeof sub.deeplink).toBe('string');

      // imageURL — может быть пустым
      expect(sub.imageURL).toBeDefined();
      expect(typeof sub.imageURL).toBe('string');
    });
  }

  private static validateBrands(brands: any[]): void {
    expect(brands.length).toBeGreaterThan(0);

    // Проверяем каждый бренд
    brands.forEach((brand, index) => {
      expect(brand.id).toBeDefined();
      expect(typeof brand.id).toBe('string');
      expect(brand.id.length).toBeGreaterThan(0);

      expect(brand.imageURL).toBeDefined();
      expect(typeof brand.imageURL).toBe('string');

      expect(brand.deeplink).toBeDefined();
      expect(typeof brand.deeplink).toBe('string');
    });

    // Проверка уникальности id брендов
    const uniqueIds = new Set(brands.map((b) => b.id));
    expect(uniqueIds.size).toBe(brands.length);
  }

  private static validateAllBrandsButton(button: any): void {
    expect(button.title).toBeDefined();
    expect(typeof button.title).toBe('string');
    expect(button.title).toBe('Все бренды');
    expect(button.deeplink).toBeDefined();
    expect(typeof button.deeplink).toBe('string');
    expect(button.iconName).toBeDefined();
    expect(typeof button.iconName).toBe('string');
    expect(button.iconName).toBe('chevron-right');
  }
}
