import { ShopRegistrationRequest } from '../../fixtures/api-clients/b2b-dml-client';
import { RandomShopGenerator } from './random-shop-generator';
import { ProductGenerator, ProductOptions, ProductCreateData } from './product-generator';

export class DataGenerators {
  static generatePhoneNumber(): string {
    const prefixes = [
      '900',
      '901',
      '902',
      '903',
      '904',
      '905',
      '906',
      '908',
      '909',
      '910',
      '911',
      '912',
      '913',
      '914',
      '915',
      '916',
      '917',
      '918',
      '919',
      '920',
      '921',
      '922',
      '923',
      '924',
      '925',
      '926',
      '927',
      '928',
      '929',
      '930',
      '931',
      '932',
      '933',
      '934',
      '935',
      '936',
      '937',
      '938',
      '939',
      '960',
      '961',
      '962',
      '963',
      '964',
      '965',
      '966',
      '967',
      '968',
      '969',
      '980',
      '981',
      '982',
      '983',
      '984',
      '985',
      '986',
      '987',
      '988',
      '989',
    ];

    const randomIndex = Math.floor(Math.random() * prefixes.length);
    const prefix = prefixes[randomIndex];
    const randomDigits = Math.random().toString().slice(2, 9);

    const phoneNumber = `+7${prefix}${randomDigits}`;
    return phoneNumber;
  }

  static generateDeviceId(): string {
    const BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let ulid = '';
    const now = Date.now();
    let time = now;

    for (let i = 0; i < 10; i++) {
      const mod = time % 32;
      ulid = BASE32[mod] + ulid;
      time = (time - mod) / 32;
    }

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * 32);
      ulid += BASE32[randomIndex];
    }

    return ulid;
  }

  private static readonly FIRST_NAMES = ['Иван', 'Петр', 'Сергей', 'Алексей', 'Дмитрий', 'Михаил', 'Андрей', 'Александр', 'Максим', 'Артем', 'Роман', 'Владимир', 'Евгений', 'Константин', 'Никита'];
  private static readonly LAST_NAMES = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Попов', 'Васильев', 'Смирнов', 'Новиков', 'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семенов'];

  static generateFirstName(): string {
    const firstNameIndex = Math.floor(Math.random() * this.FIRST_NAMES.length);
    return this.FIRST_NAMES[firstNameIndex];
  }

  static generateLastName(): string {
    const lastNameIndex = Math.floor(Math.random() * this.LAST_NAMES.length);
    return this.LAST_NAMES[lastNameIndex];
  }

  static generateBirthDate(): string {
    // Генерируем год от 1950 до 2005 (возраст 18-70 лет)
    const minYear = 1950;
    const maxYear = 2005;
    const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;

    // Генерируем месяц от 1 до 12
    const month = Math.floor(Math.random() * 12) + 1;

    // Генерируем день с учетом количества дней в месяце
    const daysInMonth = new Date(year, month, 0).getDate();
    const day = Math.floor(Math.random() * daysInMonth) + 1;

    // Форматируем в 'YYYY-MM-DD'
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  static generateEmail(): string {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@mail.ru`;
    return email;
  }

  static generateAddress() {
    const addressNumber = Math.floor(Math.random() * 100);
    const apartment = Math.floor(Math.random() * 100 + 1).toString();
    const doorphone = Math.floor(Math.random() * 1000);
    const entrance = Math.floor(Math.random() * 10) + 1;
    const floor = Math.floor(Math.random() * 20) + 1;

    const address = {
      address: `ул. Лучшая, д. ${addressNumber}`,
      apartment,
      doorphone,
      entrance,
      floor,
      isPrivateProperty: false,
    };

    return address;
  }

  static generateRUSelfEmployedShop(): ShopRegistrationRequest {
    return {
      ...RandomShopGenerator.generateForBusinessForm('self_employed'),
    };
  }

  static generateRUSIndividualEntrepreneurShop(): ShopRegistrationRequest {
    return {
      ...RandomShopGenerator.generateForBusinessForm('individual_entrepreneur'),
    };
  }

  static generateRULLCShop(): ShopRegistrationRequest {
    return {
      ...RandomShopGenerator.generateForBusinessForm('llc'),
    };
  }

  static generateOtherShop(): ShopRegistrationRequest {
    return {
      ...RandomShopGenerator.generateForBusinessForm('other'),
    };
  }

  //Для разных форм бизнеса
  static generateRandomShopData(overrides: any = {}): any {
    const randomData = RandomShopGenerator.generateRandomShopData();
    return { ...randomData, ...overrides };
  }

  // ======================== ГЕНЕРАТОРЫ ПРОДУКТОВ ========================
  // Все методы делегируются в ProductGenerator

  /**
   * Генерирует уникальные тестовые данные для создания продукта
   * Только с доступными категориями!
   *
   */
  static generateProductData(options: Partial<ProductOptions> = {}): ProductCreateData {
    return ProductGenerator.generateProductData(options);
  }

  /**
   * Генерирует продукт с МУЖСКОЙ категорией
   */
  static generateMenProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return ProductGenerator.generateMenProduct(options);
  }
  static generateMockMenProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return ProductGenerator.generateMockMenProduct();
  }
  /**
   * Генерирует продукт с ЖЕНСКОЙ категорией

   */
  static generateWomanProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return ProductGenerator.generateWomanProduct(options);
  }

  static generateMinimalWomanProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return ProductGenerator.generateMinimalWomanProduct(options);
  }

  static generateMinimalProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return ProductGenerator.generateMinimalProduct(options);
  }

  /**
   * Генерирует данные для обновления продукта

   */
  static generateProductUpdateData(options: any = {}): any {
    return ProductGenerator.generateUpdateData(options);
  }
}

export const wait = (ms: number) => {
  const promise = new Promise((resolve) => setTimeout(resolve, ms));
  return promise;
};
