import { expect } from '@playwright/test';

export class CategoryValidator {
  static validate(data: any): void {
    expect(data.categoryTitle).toBe('Верхняя одежда');
    expect(data.lotsCountDescription).toBe('');
    expect(data.filters.iconName).toBe('filter');
    expect(data.filters.title).toBe('Фильтры');
    expect(data.filters.color).toBe('accent');
    expect(data.sort.iconName).toBe('sort');
    expect(data.sort.title).toBe('Сортировка');
  }
}
