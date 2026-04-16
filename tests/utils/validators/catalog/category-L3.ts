import { expect } from '@playwright/test';

export class CategoryL3Validator {
  static validate(data: any): void {
    expect(data.title).toBe('Одежда');
    expect(Array.isArray(data.subCategories)).toBe(true);
    expect(data.subCategories.length).toBeGreaterThan(0);

    data.subCategories.forEach((sub: any) => {
      expect(sub.id).toBeDefined();
      expect(typeof sub.id).toBe('string');
      expect(sub.id.length).toBeGreaterThan(0);

      const idParts = sub.id.split('_');
      expect(idParts.length).toBe(3);

      const categoryType = idParts[0];
      expect(['men', 'woman']).toContain(categoryType);

      expect(idParts[1]).toBe('clothing');
      expect(idParts[2]).toBe('clothing-outerwear');

      expect(sub.title).toBe('Верхняя одежда');

      expect(sub.deeplink).toBeDefined();
      expect(typeof sub.deeplink).toBe('string');

      expect(sub.imageURL).toBeDefined();
      expect(typeof sub.imageURL).toBe('string');
    });

    const allIds = data.subCategories.map((s: any) => s.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  }
}
