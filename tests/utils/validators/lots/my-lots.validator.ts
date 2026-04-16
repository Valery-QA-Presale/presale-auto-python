import { expect } from '@playwright/test';

export class MyLotsValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Мои объявления');

    // ========== BANNER ==========
    expect(data.banner).toBeDefined();
    expect(data.banner.title).toBe('Зарабатывайте\nвместе с нами');
    expect(data.banner.textColor).toBe('onBackgroundVariant');

    // ========== STEPS ==========
    expect(Array.isArray(data.steps)).toBe(true);
    expect(data.steps.length).toBe(3);

    // Step 1
    expect(data.steps[0].title).toBe('1. Создайте заявку на продажу');
    expect(data.steps[0].description).toBe('Укажите описание товара, фото и цену');

    // Step 2
    expect(data.steps[1].title).toBe('2. Добавьте данные карты');
    expect(data.steps[1].description).toBe('Нам нужно знать куда отправлять вам деньги за продажу товара');

    // Step 3
    expect(data.steps[2].title).toBe('3. Начните торговать');
    expect(data.steps[2].description).toBe('Ваше объявление будет размещено на нашей платформе после проверки экспертами.');

    // ========== CREATE LOT BUTTON ==========
    expect(data.createLotButton).toBeDefined();
    expect(data.createLotButton.title).toBe('Создать объявление');
    expect(data.createLotButton.deeplink).toMatch(/^presale-app:\/\//);
    expect(data.createLotButton.deeplink.length).toBeGreaterThan(0);

    // ========== SUBTITLE ==========
    expect(data.subtitle).toBe('Для юридических лиц');

    // ========== LEGAL SECTION ==========
    expect(data.legalSection).toBeDefined();
    expect(data.legalSection.iconName).toBe('shop');
    expect(data.legalSection.title).toBe('Продавайте коллекции от вашего бренда или магазина');
    expect(data.legalSection.description).toBe('Размещайте товары и управляйте продажами через веб-версию. Удобная загрузка, аналитика и поддержка для вашего бизнеса.');

    // Legal button
    expect(data.legalSection.button).toBeDefined();
    expect(data.legalSection.button.title).toBe('Узнать больше');
    expect(data.legalSection.button.deeplink).toMatch(/^https?:\/\//);
    expect(data.legalSection.button.deeplink.length).toBeGreaterThan(0);
  }
}
