import { z } from 'zod';

export const CompleteSetSchema = z.object({
  title: z.string(),
  primaryButton: z.object({
    title: z.string(),
    deeplink: z.string(),
  }),
  completeSetItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      selected: z.boolean(),
    })
  ),
});

import { expect } from '@playwright/test';

export class CompleteSetAssertions {
  static validate(data: unknown) {
    const parsed = CompleteSetSchema.parse(data);

    this.validateBusinessLogic(parsed);
  }

  private static validateBusinessLogic(data: any) {
    // ========== ROOT ==========
    expect(data.title).toBe('Комплектация');

    // ========== ITEMS ==========
    expect(data.completeSetItems).toHaveLength(3);

    const expectedItems = [
      { id: 'dust', name: 'Пыльник' },
      { id: 'box', name: 'Коробка' },
      { id: 'label', name: 'Карточка' },
    ];

    expectedItems.forEach((expected) => {
      const item = data.completeSetItems.find(i => i.id === expected.id);

      expect(item, `Item ${expected.id} should exist`).toBeDefined();
      expect(item.name).toBe(expected.name);
      expect(item.selected).toBe(false);
    });

    // ========== UNIQUE IDS ==========
    const ids = data.completeSetItems.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);

    // ========== BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('');
  }
}