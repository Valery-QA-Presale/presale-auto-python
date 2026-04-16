import { expect } from '@playwright/test';

export class PriceCalculateValidator {
  // Минимальная цена для продажи
  private static readonly MIN_PRICE = 5000;

  static validate(data: any, context?: { price?: number }): void {
    // Проверка расчета комиссии
    if (context?.price) {
      this.validateCalculation(data, context.price);
    } else {
      this.validateValues(data);
    }
  }

  /**
   * Рассчитываем ожидаемую выручку по формуле
   */
  private static calculateExpectedRevenue(price: number): number {
    let revenue: number;

    // Если цена меньше минимальной - revenue = 0
    if (price < this.MIN_PRICE) {
      revenue = 0;
    } else if (price < 15000) {
      // Диапазон 5000 - 14 999: фиксированная комиссия 3000
      revenue = price - 3000;
    } else if (price < 50000) {
      // Диапазон 15 000 - 49 999: комиссия 12%
      revenue = price * 0.88;
    } else {
      // Диапазон 50 000+: комиссия 10%
      revenue = price * 0.9;
    }

    // Округляем до целого числа
    revenue = Math.round(revenue);

    return revenue;
  }

  private static validateValues(data: any): void {
    expect(typeof data.revenue).toBe('number');
    expect(data.revenue).toBeGreaterThanOrEqual(0);
  }

  private static validateCalculation(data: any, price: number): void {
    // Рассчитываем ожидаемую выручку
    const actualRevenue = Math.round(data.revenue);
    const expectedRevenue = this.calculateExpectedRevenue(price);
    // Проверяем округленное значение
    expect(actualRevenue).toBe(expectedRevenue);

    // Дополнительная проверка для минимальной цены
    if (price < this.MIN_PRICE) {
      expect(data.revenue).toBe(0);
    }
  }
}
