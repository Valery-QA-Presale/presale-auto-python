import { B2CApiClient } from './api-clients/b2c-api-client';
import { TestDataGenerator } from '../data/test-data';
import { config } from '../../config/config';
import { wait } from '../utils/generators/data-generators';
import { simpleRetry } from '../utils/retry-utils';

export interface B2cUserContext {
  accessToken: string;
  refreshToken: string;
  userId: string;
  deviceId: string;
  phone: string;
}
export interface B2cGuestContext {
  guestToken: string;
  deviceId: string;
}
export class B2cAuthContext {
  private deviceId: string;
  private guestToken: string | null = null;
  private isRegistering = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(private apiClient: B2CApiClient) {
    this.deviceId = TestDataGenerator.generateDeviceId();
  }

  async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    const headers = { 'device-id': this.deviceId };

    try {
      const response = await simpleRetry(
        async () => {
          const resp = await this.apiClient.post<{ success: boolean; guestToken: string }>('/auth/guest-token', { headers });
          if (!resp.data.success || !resp.data.guestToken) {
            throw new Error('Invalid guest token response');
          }
          return resp;
        },
        {
          maxAttempts: 3,
          delay: 1000,
          description: 'Get guest token',
        },
      );

      this.guestToken = response.data.guestToken;

    } catch (error) {
      this.initializationPromise = null;
      throw new Error(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async registerUser(phone?: string): Promise<B2cUserContext> {
    while (this.isRegistering) {
      await wait(200);
    }

    if (!this.guestToken) {
      await this.initialize();
    }

    const userPhone = phone || TestDataGenerator.generatePhoneNumber();
    this.isRegistering = true;
    try {
      const otpHeaders = {
        Authorization: `Bearer ${this.guestToken}`,
        'device-id': this.deviceId,
        'Content-Type': 'application/json',
      };
      const otpData = { phoneNumber: userPhone };

      const otpResponse = await simpleRetry(
        async () => {
          const resp = await this.apiClient.post<{ success: boolean; otpToken: string }>('/auth/registration/request-otp', { headers: otpHeaders, data: otpData });
          if (!resp.data.success || !resp.data.otpToken) {
            throw new Error('OTP request failed');
          }
          return resp;
        },
        {
          maxAttempts: 3,
          delay: 1500,
          description: `Request OTP for ${userPhone}`,
        },
      );

      const verifyHeaders = {
        Authorization: `Bearer ${this.guestToken}`,
        'otp-token': `Bearer ${otpResponse.data.otpToken}`,
        'device-id': this.deviceId,
        'Content-Type': 'application/json',
      };
      const verifyData = { otpCode: config.otpCode };

      const verifyResponse = await simpleRetry(
        async () => {
          const resp = await this.apiClient.post<{ accessToken: string; refreshToken: string; userId: string }>('/auth/registration/verify-otp', { headers: verifyHeaders, data: verifyData });
          if (!resp.data.accessToken) {
            throw new Error('OTP verification failed');
          }
          return resp;
        },
        {
          maxAttempts: 3,
          delay: 1000,
          description: `Verify OTP for ${userPhone}`,
        },
      );
      console.log(`[AUTH] 📞 Phone: ${userPhone}`);
      return {
        accessToken: verifyResponse.data.accessToken,
        refreshToken: verifyResponse.data.refreshToken,
        userId: verifyResponse.data.userId,
        deviceId: this.deviceId,
        phone: userPhone,

      };
    } finally {
      this.isRegistering = false;
    }

  }
  async getGuestUser(): Promise<B2cGuestContext> {
    if (!this.guestToken) {
      await this.initialize();

      console.log(`[AUTH] 🔑 Guest token (first 20 chars): ${this.guestToken.substring(0, 20)}...`);
    }

    return {
      guestToken: this.guestToken!,
      deviceId: this.deviceId,
    };
  }
  getDefaultHeaders(userContext: B2cUserContext): Record<string, string> {
    return {
      Authorization: `Bearer ${userContext.accessToken}`,
      'device-id': userContext.deviceId,
      'user-id': userContext.userId,
      'Content-Type': 'application/json',
    };
  }

  getGuestAuthHeaders(guestContext: B2cGuestContext): Record<string, string> {
    return {
      Authorization: `Bearer ${guestContext.guestToken}`,
      'device-id': guestContext.deviceId,
      'Content-Type': 'application/json',
    };
  }
}


