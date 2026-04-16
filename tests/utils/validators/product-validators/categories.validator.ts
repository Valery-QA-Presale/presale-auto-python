import { expect } from '@playwright/test';

export class CategoriesValidator {
  static validate(data: any): void {
    //  Потом конкретные значения
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // Корневой уровень
    expect(data).toHaveProperty('title');
    expect(data.title).toBe('Ассортимент');

    expect(data).toHaveProperty('primaryButton');
    expect(data.primaryButton).toBeInstanceOf(Object);

    expect(data).toHaveProperty('categoryL1');
    expect(data.categoryL1).toBeInstanceOf(Array);
    expect(data.categoryL1.length).toBe(2);

    // Primary Button
    const btn = data.primaryButton;
    expect(btn).toHaveProperty('title');
    expect(btn.title).toBe('Продолжить');
    expect(btn).toHaveProperty('deeplink');
    expect(btn.deeplink).toBe('presale-app://app/sale-advert-tab/sale-advert-info');
    expect(btn.deeplink).toMatch(/^presale-app:\/\//);

    // Мужская категория
    const menCategory = data.categoryL1.find((c: any) => c.id === 'men');
    expect(menCategory).toBeDefined();
    this.validateMenCategory(menCategory);

    // Женская категория
    const womanCategory = data.categoryL1.find((c: any) => c.id === 'woman');
    expect(womanCategory).toBeDefined();
    this.validateWomanCategory(womanCategory);
  }

  private static validateMenCategory(cat: any): void {
    expect(cat.id).toBe('men');
    expect(cat.title).toBe('Мужское');
    expect(cat.categoryL2).toBeInstanceOf(Array);
    expect(cat.categoryL2.length).toBeGreaterThan(0);

    const clothing = cat.categoryL2.find((c: any) => c.id === 'men_clothing');
    expect(clothing).toBeDefined();
    this.validateMenClothing(clothing);
  }

  private static validateMenClothing(clothing: any): void {
    expect(clothing.id).toBe('men_clothing');
    expect(clothing.title).toBe('Одежда');
    expect(clothing.categoryL3).toBeInstanceOf(Array);
    expect(clothing.categoryL3.length).toBeGreaterThan(0);

    const outerwear = clothing.categoryL3.find((c: any) => c.id === 'men_clothing_clothing-outerwear');
    expect(outerwear).toBeDefined();
    this.validateMenOuterwear(outerwear);
  }

  private static validateMenOuterwear(outerwear: any): void {
    expect(outerwear.id).toBe('men_clothing_clothing-outerwear');
    expect(outerwear.title).toBe('Верхняя одежда');
    expect(outerwear.categoryL4).toBeInstanceOf(Array);
    expect(outerwear.categoryL4.length).toBeGreaterThan(0);

    const coats = outerwear.categoryL4.find((c: any) => c.id === 'men_clothing_clothing-outerwear_coats');
    expect(coats).toBeDefined();
    expect(coats.id).toBe('men_clothing_clothing-outerwear_coats');
    expect(coats.title).toBe('Пальто');
  }
  private static validateWomanCategory(cat: any): void {
    expect(cat.id).toBe('woman');
    expect(cat.title).toBe('Женское');
    expect(cat.categoryL2).toBeInstanceOf(Array);
    expect(cat.categoryL2.length).toBeGreaterThan(0);

    const clothing = cat.categoryL2.find((c: any) => c.id === 'woman_clothing');
    expect(clothing).toBeDefined();
    this.validateWomanClothing(clothing);
  }

  private static validateWomanClothing(clothing: any): void {
    expect(clothing.id).toBe('woman_clothing');
    expect(clothing.title).toBe('Одежда');
    expect(clothing.categoryL3).toBeInstanceOf(Array);
    expect(clothing.categoryL3.length).toBeGreaterThan(0);

    const outerwear = clothing.categoryL3.find((c: any) => c.id === 'woman_clothing_clothing-outerwear');
    expect(outerwear).toBeDefined();
    this.validateWomanOuterwear(outerwear);
  }

  private static validateWomanOuterwear(outerwear: any): void {
    expect(outerwear.id).toBe('woman_clothing_clothing-outerwear');
    expect(outerwear.title).toBe('Верхняя одежда');
    expect(outerwear.categoryL4).toBeInstanceOf(Array);
    expect(outerwear.categoryL4.length).toBeGreaterThan(0);

    const coats = outerwear.categoryL4.find((c: any) => c.id === 'woman_clothing_clothing-outerwear_coats');
    expect(coats).toBeDefined();
    expect(coats.id).toBe('woman_clothing_clothing-outerwear_coats');
    expect(coats.title).toBe('Пальто');
  }
}
