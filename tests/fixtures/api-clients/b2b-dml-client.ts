import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { config } from '../../../config/config';

export interface ShopRegistrationRequest {
  country: string;
  businessForm: string;
  inn: string;
  sellerStatus: string;
  email: string;
  shopName: string;
  categories: string[];
  experience: string[];
  productsCount: string;
}

export interface ShopRegistrationResponse {
  success: boolean;
  shopId: string;
  shopName: string;
  status: 'pending' | 'approved' | 'rejected';
  nextSteps?: string[];
  registrationId: string;
}
export interface productCreateResponse {
  productId: boolean;
  length: string;
}

export class B2BDmlClient extends BaseApiClient {
  protected getBaseURL(): string {
    return config.b2bBaseURL;
  }

  constructor(request: APIRequestContext, baseURL?: string) {
    super(request, baseURL);
  }
}
