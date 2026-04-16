import { expect } from '@playwright/test';

export class BrandsValidator {
  static validate(data: any): void {
    //  Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Выберите бренд');

    // ========== SEARCH ==========
    expect(data.search.placeholder).toBe('Найти бренд');
    expect(data.search.iconName).toBe('search');

    // ========== BRAND SECTIONS ==========
    expect(Array.isArray(data.brandSections)).toBe(true);
    expect(data.brandSections.length).toBeGreaterThan(0);

    // Проходим по всем секциям
    data.brandSections.forEach((section: any, index: number) => {
      this.validateBrandSection(section, index);
    });

    // ========== ПРОВЕРКА КОНКРЕТНЫХ БРЕНДОВ ==========
    this.validateSpecificBrands(data.brandSections);
  }

  private static validateBrandSection(section: any, index: number): void {
    // Проверка что sectionTitle - это буква/цифра
    expect(section.sectionTitle).toMatch(/^[A-Z0-9]$/);

    // Проверка brands
    expect(Array.isArray(section.brands)).toBe(true);
    expect(section.brands.length).toBeGreaterThan(0);

    // Проверка каждого бренда в секции
    section.brands.forEach((brand: any) => {
      expect(brand.id).toBeDefined();
      expect(typeof brand.id).toBe('string');

      expect(brand.name).toBeDefined();
      expect(typeof brand.name).toBe('string');

      // Проверка coverS3Key
      expect(brand.coverS3Key).toBeDefined();
      expect(typeof brand.coverS3Key).toBe('string');
      expect(brand.coverS3Key.length).toBeGreaterThan(0);
      // selected всегда false в начальном состоянии
      expect(brand.selected).toBe(false);

      // isPrime может быть true или false, проверяем что это boolean если есть
      if (brand.hasOwnProperty('isPrime')) {
        expect(typeof brand.isPrime).toBe('boolean');
      }
    });
  }

  private static validateSpecificBrands(brandSections: any[]): void {
    // Ожидаемые бренды которые должны быть
    const expectedBrands = [
      { id: 'a-1', name: 'A-1', section: 'A' },
      { id: 'burberry', name: 'BURBERRY', section: 'B' },
      { id: 'celine', name: 'CELINE', section: 'C' },
      { id: 'chanel', name: 'CHANEL', section: 'C' },
      { id: 'gucci', name: 'GUCCI', section: 'G' },
      { id: 'hermes-paris', name: 'HERMES PARIS', section: 'H' },
      { id: 'prada', name: 'PRADA', section: 'P' },
      { id: 'dior', name: 'DIOR', section: 'D' },
      { id: 'dolce-gabbana', name: 'DOLCE & GABBANA', section: 'D' },
    ];

    // Для каждого ожидаемого бренда проверяем что он есть
    expectedBrands.forEach((expected) => {
      const section = brandSections.find((s) => s.sectionTitle === expected.section);
      expect(section, `Section ${expected.section} should exist`).toBeDefined();

      const brand = section.brands.find((b: any) => b.id === expected.id);
      expect(brand, `Brand ${expected.id} should exist in section ${expected.section}`).toBeDefined();
      expect(brand.name).toBe(expected.name);

      // Проверка что у известных брендов isPrime = true
      if (expected.id !== 'a-1') {
        // A-1 не prime
        expect(brand.isPrime).toBe(true);
      }
    });

    // Проверка что A-1 это единственный не-prime бренд
    brandSections.forEach((section: any) => {
      section.brands.forEach((brand: any) => {
        if (brand.id === 'a-1') {
          expect(brand.isPrime).toBeUndefined();
        } else if (brand.isPrime !== undefined) {
          // Для остальных брендов если есть isPrime, должен быть true
          expect(brand.isPrime).toBe(true);
        }
      });
    });
  }
}
