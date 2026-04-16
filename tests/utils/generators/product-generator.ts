export class ProductGenerator {
  // то что есть в библиотеке на данный момент
  private static readonly AVAILABLE_CATEGORIES = [
    {
      categoryL1: 'men',
      categoryL2: 'men_clothing',
      categoryL3: 'men_clothing_clothing-outerwear',
      categoryL4: 'men_clothing_clothing-outerwear_coats',
    },
    {
      categoryL1: 'woman',
      categoryL2: 'woman_clothing',
      categoryL3: 'woman_clothing_clothing-outerwear',
      categoryL4: 'woman_clothing_clothing-outerwear_coats',
    },
  ] as const;

  /**
   * Только с доступными категориями!
   */
  static generateProductData(options: Partial<ProductOptions> = {}): ProductCreateData {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const testId = `autotest_${timestamp}_${randomSuffix}`;

    // Выбираем случайную доступную категорию или используем переданную
    let selectedCategory = options.category;

    if (!selectedCategory) {
      // Берём случайную категорию из доступных
      const randomIndex = Math.floor(Math.random() * this.AVAILABLE_CATEGORIES.length);
      selectedCategory = { ...this.AVAILABLE_CATEGORIES[randomIndex] };
    }

    // Базовый объект продукта
    const productData: ProductCreateData = {
      category: selectedCategory,
      title: options.title || `Автотест продукт ${testId}`,
      description: options.description || `Описание для автотестового продукта ${testId}. Создан автоматически.`,
      attributes: {
        material: options.material || [{ id: 'silk' }],
        color: options.color || [{ id: 'white' }],
        condition: options.condition || { id: 'new' },
        completeSetItems: options.completeSetItems || [{ id: 'dust' }],
        usageTraces: options.usageTraces || [{ id: 'tears' }],
        year: options.year || '2024',
        renovationToggle: options.renovationToggle ?? false,
        rarityToggle: options.rarityToggle ?? false,
        brand: options.brand || { id: 'a-1' },
        model: options.model || `model-${randomSuffix}`,
        size: options.size || {
          measure: 'ru-48',
          opt: { id: 'exact' },
          locale: { id: 'ru-sizes' },
        },
      },
    };

    return productData;
  }

  /**
   * Генерирует продукт с МУЖСКОЙ категорией
   */
  static generateMenProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return this.generateProductData({
      ...options,
      category: {
        categoryL1: 'men',
        categoryL2: 'men_clothing',
        categoryL3: 'men_clothing_clothing-outerwear',
        categoryL4: 'men_clothing_clothing-outerwear_coats',
      },
    });
  }
  static generateMenProductWithPrice(price: number = 40000): ProductCreateData & { price: number } {
    return {
      ...this.generateMenProduct(),
      price,
    };
  }
  static generateMockMenProduct(): ProductCreateData {
    return {
      category: {
        categoryL1: 'men',
        categoryL2: 'men_clothing',
        categoryL3: 'men_clothing_clothing-outerwear',
        categoryL4: 'men_clothing_clothing-outerwear_coats',
      },
      title: 'Мужское пальто премиум',
      description: 'Стильное мужское пальто для холодного сезона',
      attributes: {
        material: [{ id: 'silk' }],
        color: [{ id: 'white' }],
        condition: { id: 'new' },
        completeSetItems: [{ id: 'dust' }, { id: 'box' }, { id: 'label' }],
        year: '2024',
        renovationToggle: false,
        rarityToggle: false,
        brand: { id: 'burberry' },
        model: 'Premium-Coat-2024',
        size: {
          measure: 'ru-48',
          opt: { id: 'exact' },
          locale: { id: 'ru-sizes' },
        },
      },
    };
  }

  /**
   * Генерирует продукт с ЖЕНСКОЙ категорией
   */
  static generateWomanProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return this.generateProductData({
      category: {
        categoryL1: 'woman',
        categoryL2: 'woman_clothing',
        categoryL3: 'woman_clothing_clothing-outerwear',
        categoryL4: 'woman_clothing_clothing-outerwear_coats',
      },
      title: options.title || 'Женское пальтишко',
      // 👇 Переопределяем attributes пустым объектом
      attributes: {},
    });
  }

  static generateMinimalProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const testId = `autotest_${timestamp}_${randomSuffix}`;

    let selectedCategory = options.category;
    if (!selectedCategory) {
      const randomIndex = Math.floor(Math.random() * this.AVAILABLE_CATEGORIES.length);
      selectedCategory = { ...this.AVAILABLE_CATEGORIES[randomIndex] };
    }

    // Минимальные обязательные атрибуты
    const productData: ProductCreateData = {
      category: selectedCategory,
      title: options.title || `Минимальный продукт ${testId}`,
      description: options.description || `Минимальное описание ${testId}`,
      attributes: {
        condition: { id: 'new' },
        year: '2024',
      },
    };

    return productData;
  }

  static generateMinimalMenProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return this.generateMinimalProduct({
      ...options,
      category: {
        categoryL1: 'men',
        categoryL2: 'men_clothing',
        categoryL3: 'men_clothing_clothing-outerwear',
        categoryL4: 'men_clothing_clothing-outerwear_coats',
      },
    });
  }

  static generateMinimalWomanProduct(options: Partial<ProductOptions> = {}): ProductCreateData {
    return this.generateMinimalProduct({
      ...options,
      category: {
        categoryL1: 'woman',
        categoryL2: 'woman_clothing',
        categoryL3: 'woman_clothing_clothing-outerwear',
        categoryL4: 'woman_clothing_clothing-outerwear_coats',
      },
    });
  }
  /**
   * Генерирует данные для обновления продукта
   * Только изменяемые поля
   */
  static generateUpdateData(options: Partial<ProductUpdateOptions> = {}): ProductUpdateData {
    const updateData: ProductUpdateData = {};

    // Только те поля которые можно обновлять
    if (options.title !== undefined) updateData.title = options.title;
    if (options.description !== undefined) updateData.description = options.description;
    if (options.price !== undefined) updateData.price = options.price;

    // Атрибуты для обновления
    if (options.attributes) {
      updateData.attributes = {};

      if (options.attributes.material !== undefined) updateData.attributes.material = options.attributes.material;
      if (options.attributes.color !== undefined) updateData.attributes.color = options.attributes.color;
      if (options.attributes.condition !== undefined) updateData.attributes.condition = options.attributes.condition;
      if (options.attributes.year !== undefined) updateData.attributes.year = options.attributes.year;
      if (options.attributes.renovationToggle !== undefined) updateData.attributes.renovationToggle = options.attributes.renovationToggle;
      if (options.attributes.rarityToggle !== undefined) updateData.attributes.rarityToggle = options.attributes.rarityToggle;
      if (options.attributes.brand !== undefined) updateData.attributes.brand = options.attributes.brand;
      if (options.attributes.model !== undefined) updateData.attributes.model = options.attributes.model;
      if (options.attributes.size !== undefined) updateData.attributes.size = options.attributes.size;
    }

    return updateData;
  }
}

// Интерфейсы для TypeScript
export interface ProductCreateData {
  category: {
    categoryL1: string;
    categoryL2: string;
    categoryL3: string;
    categoryL4: string;
  };
  title: string;
  description: string;
  attributes: {
    // Делаем ВСЕ атрибуты опциональными
    material?: Array<{ id: string }>;
    color?: Array<{ id: string }>;
    condition?: { id: string };
    completeSetItems?: Array<{ id: string }>;
    usageTraces?: Array<{ id: string }>;
    year?: string;
    renovationToggle?: boolean;
    rarityToggle?: boolean;
    brand?: { id: string };
    model?: string;
    size?: {
      measure: string;
      opt: { id: string };
      locale: { id: string };
    };
  };
  _testMarker?: string;
}

export interface ProductOptions {
  category?: {
    categoryL1: string;
    categoryL2: string;
    categoryL3: string;
    categoryL4: string;
  };
  title?: string;
  description?: string;
  price?: number;

  // Поля для простых случаев (на верхнем уровне)
  material?: Array<{ id: string }>;
  color?: Array<{ id: string }>;
  condition?: { id: string };
  completeSetItems?: Array<{ id: string }>;
  usageTraces?: Array<{ id: string }>;
  year?: string;
  renovationToggle?: boolean;
  rarityToggle?: boolean;
  brand?: { id: string };
  model?: string;
  size?: {
    measure: string;
    opt: { id: string };
    locale: { id: string };
  };

  attributes?: {
    material?: Array<{ id: string }>;
    color?: Array<{ id: string }>;
    condition?: { id: string };
    completeSetItems?: Array<{ id: string }>;
    usageTraces?: Array<{ id: string }>;
    year?: string;
    renovationToggle?: boolean;
    rarityToggle?: boolean;
    brand?: { id: string };
    model?: string;
    size?: {
      measure: string;
      opt: { id: string };
      locale: { id: string };
    };
  };
}

export interface ProductUpdateAttributes {
  material?: Array<{ id: string }>;
  color?: Array<{ id: string }>;
  condition?: { id: string };
  year?: string;
  renovationToggle?: boolean;
  rarityToggle?: boolean;
  brand?: { id: string };
  model?: string;
  size?: {
    measure: string;
    opt: { id: string };
    locale: { id: string };
  };
}

export interface ProductUpdateOptions {
  title?: string;
  description?: string;
  price?: number;
  attributes?: ProductUpdateAttributes;
}

export interface ProductUpdateData {
  title?: string;
  description?: string;
  price?: number;
  attributes?: ProductUpdateAttributes;
}
export interface ProductTestScenario {
  name: string;
  data: ProductCreateData;
}
