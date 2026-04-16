export * from './auth.endpoints';
export * from './profile.endpoints';
export * from './lots.endpoints';
export * from './products.endpoints';
export * from './media.endpoints';
export * from './catalog.endpoints';

import { AUTH_ENDPOINTS } from './auth.endpoints';
import { PROFILE_ENDPOINTS } from './profile.endpoints';
import { LOTS_ENDPOINTS } from './lots.endpoints';
import { PRODUCTS_ENDPOINTS } from './products.endpoints';
import { MEDIA_ENDPOINTS } from './media.endpoints';
import { CATALOG_ENDPOINTS } from './catalog.endpoints';

export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PROFILE: PROFILE_ENDPOINTS,
  LOTS: LOTS_ENDPOINTS,
  PRODUCTS: PRODUCTS_ENDPOINTS,
  MEDIA: MEDIA_ENDPOINTS,
  CATALOG: CATALOG_ENDPOINTS,
} as const;
