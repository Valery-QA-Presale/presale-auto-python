import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { config } from '../../../config/config';

export interface SuccessResponseB2b {
  success: boolean;
  addresses: string;
  addressId: string;
  title: string;
  subTitle: string;
  description: string;
  banner?: {
    message: string;
    visible: boolean;
    type: string;
    iconName: string;
    textColor: string;
    closeButtonIcon: string;
  };
}
export class B2BBffClient extends BaseApiClient {
  protected getBaseURL(): string {
    return config.b2bBffBaseURL;
  }

  constructor(request: APIRequestContext, baseURL?: string) {
    super(request, baseURL);
  }
}
