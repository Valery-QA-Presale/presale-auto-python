import { expect } from '@playwright/test';

export class CompleteSetValidator {
  static validate(data: any): void {
    //  Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Комплектация');

    // ========== COMPLETE SET ITEMS ==========
    expect(Array.isArray(data.completeSetItems)).toBe(true);
    expect(data.completeSetItems.length).toBe(3);

    // Ожидаемые элементы комплектации
    const expectedItems = [
      { id: 'dust', name: 'Пыльник' },
      { id: 'box', name: 'Коробка' },
      { id: 'label', name: 'Карточка' },
    ];

    // Проверяем каждый элемент
    expectedItems.forEach((expected) => {
      const item = data.completeSetItems.find((i: any) => i.id === expected.id);
      expect(item, `Item ${expected.id} should exist`).toBeDefined();

      expect(item.name).toBe(expected.name);
      expect(item.selected).toBe(false);
    });

    // Дополнительные проверки
    data.completeSetItems.forEach((item: any) => {
      expect(item.id).toBeDefined();
      expect(typeof item.id).toBe('string');

      expect(item.name).toBeDefined();
      expect(typeof item.name).toBe('string');

      expect(item.selected).toBe(false);
    });

    // Проверка на дубликаты id
    const itemIds = data.completeSetItems.map((i: any) => i.id);
    const uniqueIds = new Set(itemIds);
    expect(itemIds.length).toBe(uniqueIds.size);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('');
  }
}
