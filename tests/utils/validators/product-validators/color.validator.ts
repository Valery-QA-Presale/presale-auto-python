import { expect } from '@playwright/test';

export class ColorValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Выберите цвет');

    // ========== COLORS ==========
    expect(Array.isArray(data.colors)).toBe(true);
    expect(data.colors.length).toBeGreaterThanOrEqual(10);

    // Ожидаемые цвета с их HEX кодами и iconName
    const expectedColors = [
      { id: 'white', name: 'Белый', hex: '#FFFFFF', icon: 'white-circle' },
      { id: 'red', name: 'Красный', hex: '#FF0000', icon: 'red-circle' },
      { id: 'blue', name: 'Синий', hex: '#0000FF', icon: 'blue-circle' },
      { id: 'green', name: 'Зеленый', hex: '#00FF00', icon: 'green-circle' },
      { id: 'yellow', name: 'Желтый', hex: '#FFFF00', icon: 'yellow-circle' },
      { id: 'purple', name: 'Фиолетовый', hex: '#800080', icon: 'purple-circle' },
      { id: 'orange', name: 'Оранжевый', hex: '#FFA500', icon: 'orange-circle' },
      { id: 'pink', name: 'Розовый', hex: '#FFC0CB', icon: 'pink-circle' },
      { id: 'brown', name: 'Коричневый', hex: '#A52A2A', icon: 'brown-circle' },
      { id: 'black', name: 'Черный', hex: '#000000', icon: 'black-circle' },
      { id: 'gray', name: 'Серый', hex: '#808080', icon: 'gray-circle' },
      { id: 'pistachio', name: 'Фисташковый', hex: '#D2691E', icon: 'pistashio-circle' },
    ];

    // Проверяем каждый ожидаемый цвет
    expectedColors.forEach((expected) => {
      const color = data.colors.find((c: any) => c.id === expected.id);
      expect(color, `Color ${expected.id} should exist`).toBeDefined();

      expect(color.name).toBe(expected.name);
      expect(color.color.toUpperCase()).toBe(expected.hex);
      expect(color.iconName).toBe(expected.icon); //
      expect(color.selected).toBe(false);
    });

    // Проверяем все цвета
    data.colors.forEach((color: any) => {
      // Проверка обязательных полей
      expect(color.id).toBeDefined();
      expect(typeof color.id).toBe('string');

      expect(color.name).toBeDefined();
      expect(typeof color.name).toBe('string');

      // Проверка формата iconName
      expect(color.iconName).toMatch(/^[a-z]+-circle$/);

      // Проверка HEX формата
      expect(color.color).toMatch(/^#[0-9A-Fa-f]{6}$/);

      // Проверка длины HEX (должен быть 7 символов: # + 6 цифр)
      expect(color.color.length).toBe(7);

      // selected всегда false в начальном состоянии
      expect(color.selected).toBe(false);
    });

    // Проверка на дубликаты id
    const colorIds = data.colors.map((c: any) => c.id);
    const uniqueIds = new Set(colorIds);
    expect(colorIds.length).toBe(uniqueIds.size);

    // Проверка что все HEX коды уникальны (нет повторяющихся цветов)
    const hexCodes = data.colors.map((c: any) => c.color);
    const uniqueHex = new Set(hexCodes);
    expect(hexCodes.length).toBe(uniqueHex.size);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('');
  }
}
