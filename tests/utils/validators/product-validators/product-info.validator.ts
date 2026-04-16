import { expect } from '@playwright/test';

export class ProductInfoValidator {
  static validate(data: any): void {
    //  Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Состояние');

    // ========== CONDITION ==========
    expect(data.condition).toBeInstanceOf(Array);
    expect(data.condition.length).toBe(3);

    // Проверяем каждый condition
    const conditionMap = {
      new: 'Новое',
      perfect: 'Идеальное',
      with_history: 'С историей',
    };

    data.condition.forEach((item: any) => {
      expect(conditionMap[item.id]).toBe(item.name);
      if (item.selected !== undefined) {
        expect(typeof item.selected).toBe('boolean');
      }
    });

    // ========== PRODUCT NAME SECTION ==========
    const nameSection = data.productNameSection;
    expect(nameSection.title).toBe('Название объявления');
    expect(nameSection.titleMaxLength).toBe(255);
    expect(nameSection.placeholder).toBe('Название');
    expect(nameSection.label).toBe('Название');
    expect(nameSection.value).toBe('');
    expect(nameSection.validate).toBeInstanceOf(Array);

    // ========== PRODUCT INFO SECTION ==========
    const infoSection = data.productInfoSection;
    expect(infoSection.title).toBe('Информация о товаре');

    this.validateField(infoSection.brand, 'Бренд');
    this.validateField(infoSection.size, 'Размер');
    this.validateField(infoSection.material, 'Материал');
    this.validateField(infoSection.color, 'Цвет');

    // ========== PRODUCT DETAILS SECTION ==========
    const detailsSection = data.productDetailsSection;
    expect(detailsSection.title).toBe('Детали');
    expect(detailsSection.description).toBe('Данный раздел не является обязательным для заполнения, но поможет покупателю быстрее определиться с покупкой');

    this.validateField(detailsSection.model, 'Модель');
    this.validateField(detailsSection.year, 'Год');
    this.validateField(detailsSection.completeSetItems, 'Комплектация');
    this.validateField(detailsSection.usageTraces, 'Следы использования');

    // ========== TOGGLES ==========
    expect(data.renovationToggle.title).toBe('Реставрация');
    expect(data.renovationToggle.value).toBe(false);

    expect(data.rariryToggle.title).toBe('Лимит/редкость');
    expect(data.rariryToggle.value).toBe(false);

    // ========== BUTTONS ==========
    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toBe('');

    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('presale-app://app/sale-advert-tab/photo-selections');
    expect(data.primaryButton.deeplink).toMatch(/^presale-app:\/\//);
  }

  private static validateField(field: any, expectedLabel: string): void {
    expect(field.placeholder).toBe(expectedLabel);
    expect(field.label).toBe(expectedLabel);
    expect(field.value).toBe('');
    expect(field.validate).toBeInstanceOf(Array);
    expect(field.deeplink).toBe('');
  }
}
