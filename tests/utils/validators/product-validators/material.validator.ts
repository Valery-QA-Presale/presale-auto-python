import { expect } from '@playwright/test';

export class MaterialValidator {
  static validate(data: any): void {
    //  Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Выберите материал');

    // ========== MATERIALS ==========
    expect(Array.isArray(data.materials)).toBe(true);
    expect(data.materials.length).toBeGreaterThanOrEqual(2);

    // Проверяем конкретные материалы которые должны быть всегда
    const expectedMaterials = [
      { id: 'akril', name: 'Акрил' },
      { id: 'silk', name: 'Шелк' },
    ];

    expectedMaterials.forEach((expected) => {
      const material = data.materials.find((m: any) => m.id === expected.id);
      expect(material, `Material ${expected.id} should exist`).toBeDefined();
      expect(material.name).toBe(expected.name);
      expect(material.selected).toBe(false);
    });

    // Проверяем все материалы
    data.materials.forEach((material: any) => {
      // Проверка обязательных полей
      expect(material.id).toBeDefined();
      expect(typeof material.id).toBe('string');
      expect(material.id.length).toBeGreaterThan(0);

      expect(material.name).toBeDefined();
      expect(typeof material.name).toBe('string');
      expect(material.name.length).toBeGreaterThan(0);

      // selected всегда false в начальном состоянии
      expect(material.selected).toBe(false);
    });

    // Проверка на дубликаты id
    const materialIds = data.materials.map((m: any) => m.id);
    const uniqueIds = new Set(materialIds);
    expect(materialIds.length).toBe(uniqueIds.size);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('');
  }
}
