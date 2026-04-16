export class RandomShopGenerator {
  // Список реальных ИНН (12 цифр для ИП/самозанятый)
  private static readonly VALID_INDIVIDUAL_INNS = ['123456789012', '234567890123', '345678901234', '456789012345', '567890123456', '678901234567', '789012345678', '890123456789', '901234567890'];

  private static readonly VALID_LLC_INNS = ['1234567890', '2345678901', '3456789012', '4567890123', '5678901234', '6789012345', '7890123456', '8901234567', '9012345678'];

  // Список валидных email доменов
  private static readonly EMAIL_DOMAINS = ['gmail.com', 'yandex.ru', 'mail.ru', 'outlook.com', 'hotmail.com', 'test.ru'];

  // Список категорий товаров
  private static readonly CATEGORIES = ['outerwear', 'footwear', 'accessories', 'jewelry', 'other'];

  // Опыт продаж
  private static readonly EXPERIENCE_TYPES = ['marketplaces', 'own_online_shop', 'no_experience'];

  // Количество товаров
  private static readonly PRODUCTS_COUNT = ['0_10', '11_30', 'more_30', 'unknown_has', 'no_products_yet'];

  // Статусы продавца
  private static readonly SELLER_STATUSES = ['goods_seller', 'service_provider', 'both', 'other'];

  // Формы бизнеса
  private static readonly BUSINESS_FORMS = ['self_employed', 'individual_entrepreneur', 'llc', 'other'];

  // Страны (коды)
  private static readonly COUNTRIES = ['RU', 'BY', 'KZ', 'OTHER'];

  // Случайные названия магазинов
  private static readonly SHOP_NAME_PREFIXES = ['Магазин', 'Бутик', 'Салон', 'Студия', 'Центр', 'Онлайн', 'Диджитал', 'Профи', 'Элит', 'Гранд'];

  private static readonly SHOP_NAME_SUFFIXES = ['Мод', 'Стиль', 'Тренд', 'Шик', 'Люкс', 'Техно', 'Гаджет', 'Бьюти', 'Фитнес', 'Хобби'];

  // Случайные слова для email
  private static readonly EMAIL_WORDS = ['shop', 'store', 'market', 'buy', 'sell', 'online', 'digital', 'best', 'top', 'prime'];

  /**
   * Генерирует случайный ИНН в зависимости от формы бизнеса
   */
  static getRandomINN(businessForm?: string): string {
    // Если указана форма бизнеса, генерируем соответствующий ИНН
    if (businessForm === 'llc') {
      // ООО - 10 цифр
      if (Math.random() > 0.3) {
        return this.getRandomElement(this.VALID_LLC_INNS);
      }
      return this.generateLLCINN();
    } else {
      // ИП или самозанятый - 12 цифр
      if (Math.random() > 0.3) {
        return this.getRandomElement(this.VALID_INDIVIDUAL_INNS);
      }
      return this.generateIndividualINN();
    }
  }

  /**
   * Генерирует ИНН для ИП/самозанятых (12 цифр)
   */
  private static generateIndividualINN(): string {
    let inn = '';
    for (let i = 0; i < 12; i++) {
      inn += Math.floor(Math.random() * 10);
    }
    return inn;
  }

  /**
   * Генерирует ИНН для ООО (10 цифр)
   */
  private static generateLLCINN(): string {
    let inn = '';
    for (let i = 0; i < 10; i++) {
      inn += Math.floor(Math.random() * 10);
    }
    return inn;
  }

  /**
   * Генерирует полностью случайные валидные данные для регистрации магазина
   */
  static generateRandomShopData(): any {
    const businessForm = this.getRandomElement(this.BUSINESS_FORMS);

    return {
      country: this.getRandomElement(this.COUNTRIES),
      businessForm: businessForm,
      inn: this.getRandomINN(businessForm), //  ПЕРЕДАЕМ ФОРМУ БИЗНЕСА!
      sellerStatus: this.getRandomElement(this.SELLER_STATUSES),
      email: this.generateRandomEmail(),
      shopName: this.generateRandomShopName(),
      categories: this.getRandomCategories(),
      experience: this.getRandomExperience(),
      productsCount: this.getRandomElement(this.PRODUCTS_COUNT),
    };
  }

  /**
   * Генерирует данные для конкретной формы бизнеса
   */
  static generateForBusinessForm(businessForm: string): any {
    const baseData = {
      country: this.getRandomElement(this.COUNTRIES),
      businessForm: businessForm,
      inn: this.getRandomINN(businessForm), //  передаем форму!
      sellerStatus: this.getRandomElement(this.SELLER_STATUSES),
      email: this.generateRandomEmail(),
      shopName: this.generateRandomShopName(),
      categories: this.getRandomCategories(),
      experience: this.getRandomExperience(),
      productsCount: this.getRandomElement(this.PRODUCTS_COUNT),
    };
    return baseData;
  }

  /**
   * Генерирует случайный email
   */
  static generateRandomEmail(): string {
    const word = this.getRandomElement(this.EMAIL_WORDS);
    const domain = this.getRandomElement(this.EMAIL_DOMAINS);
    const randomNum = Math.floor(Math.random() * 10000);
    const timestamp = Date.now();

    // Разные форматы для разнообразия
    const formats = [`${word}${randomNum}@${domain}`, `${word}.${timestamp}@${domain}`, `test.${word}.${randomNum}@${domain}`, `shop${timestamp}@${domain}`];

    return this.getRandomElement(formats);
  }

  /**
   * Генерирует случайное название магазина
   */
  static generateRandomShopName(): string {
    const prefix = this.getRandomElement(this.SHOP_NAME_PREFIXES);
    const suffix = this.getRandomElement(this.SHOP_NAME_SUFFIXES);
    const randomNum = Math.floor(Math.random() * 1000);

    const formats = [`${prefix} "${suffix}"`, `${prefix} ${suffix} ${randomNum}`, `${prefix} ${suffix}`, `${suffix} ${prefix}`, `Онлайн-${prefix} "${suffix}"`];

    return this.getRandomElement(formats);
  }

  /**
   * Генерирует случайный массив категорий (1-3 категории)
   */
  static getRandomCategories(): string[] {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 категории
    const shuffled = [...this.CATEGORIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Генерирует случайный массив опыта (1-3 пункта)
   */
  static getRandomExperience(): string[] {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 пункта
    const shuffled = [...this.EXPERIENCE_TYPES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Вспомогательный метод: случайный элемент из массива
   */
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Генерирует данные для теста без перезаписи email
   * (для тестов на дубликаты)
   */
  static generateUniqueShopData(): any {
    const data = this.generateRandomShopData();

    // Гарантируем уникальность email
    data.email = `unique_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@test.ru`;

    // Гарантируем уникальность названия
    data.shopName = `Уникальный магазин ${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return data;
  }

  /**
   * Генерирует данные для негативных тестов
   */
  static generateInvalidData(type: 'email' | 'inn' | 'empty' | 'wrong_type'): any {
    const baseData = this.generateRandomShopData();

    switch (type) {
      case 'email':
        baseData.email = 'invalid-email';
        break;

      case 'inn':
        baseData.inn = '123'; // Слишком короткий
        break;

      case 'empty':
        // Возвращаем пустые обязательные поля
        return {
          country: '',
          businessForm: '',
          inn: '',
          sellerStatus: '',
          email: '',
          shopName: '',
        };

      case 'wrong_type':
        // Неправильные типы данных
        return {
          country: 123,
          businessForm: true,
          inn: null,
          sellerStatus: {},
          email: 456,
          shopName: [],
        };
    }

    return baseData;
  }
}
