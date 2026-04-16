export const LOTS_ENDPOINTS = {
  GET: {
    MY_LOTS: '/my-lots',
    ACTIVE: '/screen/lots-active',
    ACTIVE_LIST: '/screen/lots-active-list',
    HISTORY: '/screen/lots-history',
    HISTORY_LIST: '/screen/lots-history-list',
    PRODUCTS_DRAFT: '/screen/products-draft',
    DRAFT_LIST: '/screen/product-list',
  },
  POST: {
    DRAFT_DELETE: '/draft-delete',
  },
} as const;
