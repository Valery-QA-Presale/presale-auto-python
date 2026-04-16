import { expect } from '@playwright/test';

export class SizeValidator {
  static validate(data: any): void {
    // Проверка конкретных значений
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== КОРНЕВОЙ УРОВЕНЬ ==========
    expect(data.title).toBe('Размеры');

    // ========== LOCALE SECTION ==========
    expect(Array.isArray(data.localeSection)).toBe(true);
    expect(data.localeSection.length).toBe(4);

    // Проверяем каждую локализацию
    const expectedLocales = [
      { countryCode: 'RU', id: 'ru-sizes', sizeCount: 10, expectedSizes: ['44', '46', '48', '50', '52', '54', '56', '58', '60', '62'] },
      { countryCode: 'INT', id: 'int-sizes', sizeCount: 10, expectedSizes: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', '4xl', '5xl', '6xl'] },
      { countryCode: 'IT/EU', id: 'it-sizes', sizeCount: 10, expectedSizes: ['44', '46', '48', '50', '52', '54', '56', '58', '60', '62'] },
      { countryCode: 'UK/US', id: 'uk-sizes', sizeCount: 10, expectedSizes: ['34', '36', '38', '40', '42', '44', '46', '48', '50', '52'] },
    ];

    expectedLocales.forEach((expected) => {
      const locale = data.localeSection.find((l: any) => l.countryCode === expected.countryCode);
      expect(locale, `Locale ${expected.countryCode} should exist`).toBeDefined();

      expect(locale.id).toBe(expected.id);
      expect(Array.isArray(locale.sizesTable)).toBe(true);
      expect(locale.sizesTable.length).toBe(expected.sizeCount);

      // Проверяем каждый размер в таблице
      locale.sizesTable.forEach((size: any, index: number) => {
        expect(size.name).toBe(expected.expectedSizes[index]);

        // Проверяем формат id
        if (expected.countryCode === 'RU') {
          expect(size.id).toMatch(/^ru-\d+$/); // ru-44, ru-46 и т.д.
        } else if (expected.countryCode === 'INT') {
          expect(size.id).toMatch(/^int-[a-z0-9]+$/); //   ПРИНИМАЕТ БУКВЫ И ЦИФРЫ
        } else if (expected.countryCode === 'IT/EU') {
          expect(size.id).toMatch(/^it-eu-\d+$/); // it-eu-44, it-eu-46
        } else if (expected.countryCode === 'UK/US') {
          expect(size.id).toMatch(/^uk-us-\d+$/); // uk-us-34, uk-us-36
        }
      });
    });

    // ========== SIZE OPT SECTION ==========
    const optSection = data.sizeOptSection;
    expect(optSection.title).toBe('Соответствие размеру');
    expect(Array.isArray(optSection.opt)).toBe(true);
    expect(optSection.opt.length).toBe(3);

    // Проверяем опции соответствия размеру
    const expectedOpts = [
      { name: 'Маломерит', id: 'less' },
      { name: 'Соответствует размеру', id: 'exact' },
      { name: 'Большемерит', id: 'great' },
    ];

    expectedOpts.forEach((expected, index) => {
      expect(optSection.opt[index].name).toBe(expected.name);
      expect(optSection.opt[index].id).toBe(expected.id);
    });

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toBe('');
  }
}
