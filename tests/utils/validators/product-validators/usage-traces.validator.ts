import { expect } from '@playwright/test';

export class UsageTracesValidator {
  static validate(data: any): void {
    // 2. Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Следы использования');

    // ========== USAGE TRACES ==========
    expect(Array.isArray(data.usageTraces)).toBe(true);
    expect(data.usageTraces.length).toBe(4);

    const expectedTraces = [
      { id: 'scratches', name: 'Царапины' },
      { id: 'stains', name: 'Пятна' },
      { id: 'tears', name: 'Порезы' },
      { id: 'fading', name: 'Выцветание' },
    ];

    // Проверяем каждый след использования
    expectedTraces.forEach((expected) => {
      const trace = data.usageTraces.find((t: any) => t.id === expected.id);
      expect(trace, `Trace ${expected.id} should exist`).toBeDefined();

      expect(trace.name).toBe(expected.name);
      expect(trace.selected).toBe(false);
    });

    // Дополнительные проверки
    data.usageTraces.forEach((trace: any) => {
      expect(trace.id).toBeDefined();
      expect(typeof trace.id).toBe('string');

      expect(trace.name).toBeDefined();
      expect(typeof trace.name).toBe('string');

      expect(trace.selected).toBe(false);
    });

    // Проверка на дубликаты id
    const traceIds = data.usageTraces.map((t: any) => t.id);
    const uniqueIds = new Set(traceIds);
    expect(traceIds.length).toBe(uniqueIds.size);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('');
  }
}
