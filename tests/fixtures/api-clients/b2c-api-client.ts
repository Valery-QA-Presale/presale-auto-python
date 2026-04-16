import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { config } from '../../../config/config';

export interface SuccessResponse {
  privateProperty: string;
  floor: string;
  entrance: string;
  doorphone: string;
  apartment: string;
  address: string;
  success: boolean;
  firstName?: string;
  lastName?: string;
  addresses?: string;
  addressId?: string;
  screenMessage?: string;
  productId?: string;
  revenue?: number;
  price?: number;
  value?: string;
  products?: [productId: string, title: string];
  banner?: {
    message: string;
    visible: boolean;
    type: string;
    iconName: string;
    textColor: string;
    closeButtonIcon: string;
  };

  title?: string;
  phone?: {
    placeholder: string;
    label: string;
    value: string;
    validate: any[];
  };
  email?: {
    placeholder: string;
    label: string;
    value: string;
    validate: any[];
  };
  primaryButton?: {
    title: string;
    deeplink: string;
    iconName: string;
  };
  supportButton?: {
    deeplink: string;
    iconName: string;
    title: string;
    markdownText: string;
    action: {
      type: string;
      phoneNumber: string;
    };
  };
  policyMarkdownText?: string;
}

export class B2CApiClient extends BaseApiClient {
  protected getBaseURL(): string {
    return config.b2cBaseURL;
  }

  constructor(request: APIRequestContext, baseURL?: string) {
    super(request, baseURL);
  }
}
