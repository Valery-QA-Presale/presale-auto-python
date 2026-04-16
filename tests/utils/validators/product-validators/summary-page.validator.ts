import { expect } from '@playwright/test';

export class SummaryPageValidator {
  static validate(data: any, context?: { hasProductId?: boolean }): void {
    // Проверка в зависимости от контекста
    if (context?.hasProductId) {
      this.validateFilledData(data);
    } else {
      this.validateEmptyData(data);
    }
  }

  /**
   * Валидация для ПУСТОГО черновика (без productId)
   * Проверяем структуру и что все value пустые/дефолтные
   */
  private static validateEmptyData(data: any): void {
    // ========== NOTICE SECTION ==========
    expect(data.noticeSection.title).toBe('При обнаружении подделки или несоответствия описанию товар будет возвращён за ваш счёт, а доступ к платформе ограничен.');
    expect(data.noticeSection.iconName).toBe('attention');
    expect(data.noticeSection.color).toBe('colorSurface');

    // ========== CATEGORY SECTION ==========
    expect(data.categorySection.title).toBe('Категория');

    expect(data.categorySection.categoryL1.title).toBe('Пол');
    expect(data.categorySection.categoryL1.value).toBe('');

    expect(data.categorySection.categoryL2.title).toBe('Категория');
    expect(data.categorySection.categoryL2.value).toBe('');

    expect(data.categorySection.categoryL3.title).toBe('Подкатегория');
    expect(data.categorySection.categoryL3.value).toBe('');

    expect(data.categorySection.categoryL4.title).toBe('Тип товара');
    expect(data.categorySection.categoryL4.value).toBe('');

    // ========== PRODUCT INFO SECTION ==========
    expect(data.productInfoSection.sectionTitle).toBe('Информация о товаре');

    // Condition
    expect(data.productInfoSection.condition.title).toBe('Состояние');
    expect(data.productInfoSection.condition.value).toBe('');

    // Title
    expect(data.productInfoSection.title.title).toBe('Название');
    expect(data.productInfoSection.title.value).toBe('');

    // Brand
    expect(data.productInfoSection.brand.title).toBe('Бренд');
    expect(data.productInfoSection.brand.value).toBe('');

    // Size
    expect(data.productInfoSection.sizeValue.title).toBe('Размер');
    expect(data.productInfoSection.sizeValue.value).toBe('');
    expect(typeof data.productInfoSection.sizeValue.value).toBe('string');

    // Material
    expect(data.productInfoSection.material.title).toBe('Материал');
    expect(data.productInfoSection.material.value).toBe('');
    expect(typeof data.productInfoSection.material.value).toBe('string');

    // Color
    expect(data.productInfoSection.color.title).toBe('Цвет');
    expect(data.productInfoSection.color.value).toBe('');
    expect(typeof data.productInfoSection.color.value).toBe('string');

    // Year
    expect(data.productInfoSection.year.title).toBe('Год');
    expect(data.productInfoSection.year.value).toBe('');

    // Complete set
    expect(data.productInfoSection.completeSetItems.title).toBe('Комплектация');
    expect(data.productInfoSection.completeSetItems.value).toBe('');

    // Usage traces
    expect(data.productInfoSection.usageTraces.title).toBe('Следы использования');
    expect(data.productInfoSection.usageTraces.value).toBe('');

    // Toggles
    expect(data.productInfoSection.renovationToggle.title).toBe('Реставрация');
    expect(data.productInfoSection.renovationToggle.value).toBe(false);

    expect(data.productInfoSection.rarityToggle.title).toBe('Лимит/редкость');
    expect(data.productInfoSection.rarityToggle.value).toBe(false);

    // Change button
    expect(data.productInfoSection.changeButton.title).toBe('Изменить');
    expect(data.productInfoSection.changeButton.deeplink).toBe('');

    // ========== PRODUCT PHOTOS SECTION ==========
    expect(Array.isArray(data.productPhotosSection.productImages)).toBe(true);
    expect(data.productPhotosSection.productImages.length).toBe(0);
    expect(data.productPhotosSection.changeButton.title).toBe('Изменить');
    expect(data.productPhotosSection.changeButton.deeplink).toBe('');

    // ========== DESCRIPTION SECTION ==========
    expect(data.descriptionSection.title).toBe('Описание');
    expect(data.descriptionSection.changeButton.title).toBe('Изменить');
    expect(data.descriptionSection.changeButton.deeplink).toBe('');

    // ========== ADDRESS SECTION ==========
    expect(data.addressSection.title).toBe('Адрес');
    expect(data.addressSection.addressValue).toBe('');
    expect(data.addressSection.changeButton.title).toBe('Изменить');
    expect(data.addressSection.changeButton.deeplink).toBe('');

    // ========== PRICE SECTION ==========
    expect(data.priceSection.title).toBe('Цена продажи');
    expect(data.priceSection.price).toBe(0);
    expect(data.priceSection.changeButton.title).toBe('Изменить');
    expect(data.priceSection.changeButton.deeplink).toBe('');

    // ========== CARD SECTION ==========
    expect(data.cardSection.title).toBe('Карта');
    expect(data.cardSection.card.cardId).toBe('1');
    expect(data.cardSection.card.title).toBe('Банковская карта');
    expect(data.cardSection.card.bankName).toBe('Райффайзенбанк');
    expect(data.cardSection.card.cardNumber).toBe('*9999');
    expect(data.cardSection.card.iconName).toBe('frb');
    expect(data.cardSection.changeButton.title).toBe('Изменить');
    expect(data.cardSection.changeButton.deeplink).toBe('');

    // ========== BUTTONS ==========
    expect(data.primaryButton.title).toBe('Опубликовать');
    expect(data.primaryButton.deeplink).toBe('');

    expect(data.removeButton.title).toBe('Удалить черновик');
    expect(data.removeButton.deeplink).toBe('');

    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toBe('');
  }

  /**
   * Валидация для ЗАПОЛНЕННОГО черновика (с productId)
   * Проверяем наш хардкод
   */
  private static validateFilledData(data: any): void {
    // ========== NOTICE SECTION ==========
    expect(data.noticeSection.title).toBe('При обнаружении подделки или несоответствия описанию товар будет возвращён за ваш счёт, а доступ к платформе ограничен.');
    expect(data.noticeSection.iconName).toBe('attention');
    expect(data.noticeSection.color).toBe('colorSurface');

    // ========== CATEGORY SECTION ==========
    expect(data.categorySection.title).toBe('Категория');

    expect(data.categorySection.categoryL1.title).toBe('Пол');
    expect(data.categorySection.categoryL1.value).toBe('Мужское');

    expect(data.categorySection.categoryL2.title).toBe('Категория');
    expect(data.categorySection.categoryL2.value).toBe('Одежда');

    expect(data.categorySection.categoryL3.title).toBe('Подкатегория');
    expect(data.categorySection.categoryL3.value).toBe('Верхняя одежда');

    expect(data.categorySection.categoryL4.title).toBe('Тип товара');
    expect(data.categorySection.categoryL4.value).toBe('Пальто');

    // ========== PRODUCT INFO SECTION ==========
    expect(data.productInfoSection.sectionTitle).toBe('Информация о товаре');

    // Condition (объект)
    expect(data.productInfoSection.condition.title).toBe('Состояние');
    expect(data.productInfoSection.condition.value).toBe('Новое');

    // Title
    expect(data.productInfoSection.title.title).toBe('Название');
    expect(data.productInfoSection.title.value).toBe('Мужское пальто премиум');

    // Brand
    expect(data.productInfoSection.brand.title).toBe('Бренд');
    expect(data.productInfoSection.brand.value).toBe('BURBERRY');

    // Size (массив объектов)
    expect(data.productInfoSection.sizeValue.title).toBe('Размер');
    expect(typeof data.productInfoSection.sizeValue.value).toBe('string');

    // Проверка  размера
    expect(data.productInfoSection.sizeValue.title).toBe('Размер');
    const sizeValue = data.productInfoSection.sizeValue.value;
    expect(typeof sizeValue).toBe('string');

    // Проверяю размер и соответствие
    expect(sizeValue).toContain('48');
    expect(sizeValue).toContain('RU');
    expect(sizeValue).toContain('соответствует размеру');

    // Material
    expect(data.productInfoSection.material.title).toBe('Материал');
    expect(data.productInfoSection.material.value).toBe('шелк');

    // Color
    expect(data.productInfoSection.color.title).toBe('Цвет');
    expect(data.productInfoSection.color.value).toBe('белый');

    // Year
    expect(data.productInfoSection.year.title).toBe('Год');
    expect(data.productInfoSection.year.value).toBe('2024');

    // Complete set
    expect(data.productInfoSection.completeSetItems.title).toBe('Комплектация');
    expect(data.productInfoSection.completeSetItems.value).toBe('пыльник, коробка, карточка');

    // Usage traces
    expect(data.productInfoSection.usageTraces.title).toBe('Следы использования');

    // Toggles
    expect(data.productInfoSection.renovationToggle.title).toBe('Реставрация');
    expect(data.productInfoSection.renovationToggle.value).toBe(false);

    expect(data.productInfoSection.rarityToggle.title).toBe('Лимит/редкость');
    expect(data.productInfoSection.rarityToggle.value).toBe(false);

    // Change button
    expect(data.productInfoSection.changeButton.title).toBe('Изменить');
    expect(data.productInfoSection.changeButton.deeplink).toBe('');

    // ========== PRODUCT PHOTOS SECTION ==========
    expect(Array.isArray(data.productPhotosSection.productImages)).toBe(true);
    expect(data.productPhotosSection.productImages.length).toBe(0);
    expect(data.productPhotosSection.changeButton.title).toBe('Изменить');
    expect(data.productPhotosSection.changeButton.deeplink).toBe('');

    // ========== DESCRIPTION SECTION ==========
    expect(data.descriptionSection.description).toBe('Стильное мужское пальто для холодного сезона');
    expect(data.descriptionSection.changeButton.title).toBe('Изменить');
    expect(data.descriptionSection.changeButton.deeplink).toBe('');

    // ========== ADDRESS SECTION ==========
    expect(data.addressSection.title).toBe('Адрес');
    expect(data.addressSection.addressValue).toBe('');
    expect(data.addressSection.changeButton.title).toBe('Изменить');
    expect(data.addressSection.changeButton.deeplink).toBe('');

    // ========== PRICE SECTION ==========
    expect(data.priceSection.title).toBe('Цена продажи');
    expect(data.priceSection.price).toBe(0);
    expect(data.priceSection.changeButton.title).toBe('Изменить');
    expect(data.priceSection.changeButton.deeplink).toBe('');

    // ========== CARD SECTION ==========
    expect(data.cardSection.title).toBe('Карта');
    expect(data.cardSection.card.cardId).toBe('1');
    expect(data.cardSection.card.title).toBe('Банковская карта');
    expect(data.cardSection.card.bankName).toBe('Райффайзенбанк');
    expect(data.cardSection.card.cardNumber).toBe('*9999');
    expect(data.cardSection.card.iconName).toBe('frb');
    expect(data.cardSection.changeButton.title).toBe('Изменить');
    expect(data.cardSection.changeButton.deeplink).toBe('');

    // ========== BUTTONS ==========
    // TODO: 10.03.2026 - Уточнение условий для отображения кнопки
    //  expect(data.primaryButton.title).toBe('Опубликовать');
    //  expect(data.primaryButton.deeplink).toBe('');

    expect(data.removeButton.title).toBe('Удалить черновик');
    expect(data.removeButton.deeplink).toBe('');
    // TODO: 25.03.2026 - Уточненить когда добавят модель!

    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toBe('');
  }
}
