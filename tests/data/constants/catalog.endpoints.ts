export const CATALOG_ENDPOINTS = {
  GET: {
    CATALOG_MAIN_WOMAN: '/screen/catalog-main-woman',
    CATALOG_MAIN_MAN: '/screen/catalog-main-man',
    CATEGORY_L3: '/screen/category-l3',
    CATEGORY_L4: '/screen/category-l4',
    SCREEN_CATEGORY: '/screen/category',
  },
  POST: {
    MARKET_ADD_FAVORITE: '/market/favorite-add',
    MARKET_DELETE_FAVORITE: '/market/favorite-delete',
  },
} as const;
