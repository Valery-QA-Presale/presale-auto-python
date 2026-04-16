import { B2BDmlClient } from './api-clients/b2b-dml-client';
import { B2BBffClient } from './api-clients/b2b-bff-client';
import { TestDataGenerator } from '../data/test-data';
import { config } from '../../config/config';
import { wait } from '../utils/generators/data-generators';
import { B2cUserContext } from './b2c-auth-context';

export interface B2BUserContext {
  accessToken: string;
  refreshToken: string;
  userId: string;
  deviceId: string;
  phone: string;
  guestToken?: string;
  otpToken?: string;
}

export class B2BAuthContext {
  private deviceId: string;
  private guestToken: string | null = null;
  private isRegistering = false;
  private initializationPromise: Promise<void> | null = null;

  //  наш б2б использует два клиента: DML для POST, BFF для GET
  constructor(
    private dmlClient: B2BDmlClient,
    b2bBffClient: B2BBffClient,
  ) {
    this.deviceId = TestDataGenerator.generateDeviceId();
  }

  //Инициализация получаю  guest token
  async initialize(): Promise<void> {
    //  ФИКС: проверяем promise ДО выполнения запроса
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    const headers = { 'device-id': this.deviceId };

    try {
      const response = await this.dmlClient.post<{ success: boolean; guestToken: string }>('/b2b/auth/guest-token', { headers });

      if (response.data) {
        this.guestToken = response.data.guestToken;
      } else {
        throw new Error('Failed to get guest token: API returned unsuccessful response');
      }
    } catch (error) {
      this.initializationPromise = null; // Сбрасываем promise для повторной попытки
      throw new Error(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async registerUser(phone?: string): Promise<B2cUserContext> {
    if (this.isRegistering) {
      await wait(2000);
      return this.registerUser(phone);
    }

    if (!this.guestToken) {
      await this.initialize();
    }

    const userPhone = phone || TestDataGenerator.generatePhoneNumber();

    const otpHeaders = {
      Authorization: `Bearer ${this.guestToken}`,
      'device-id': this.deviceId,
      'Content-Type': 'application/json',
    };
    const otpData = { phoneNumber: userPhone };

    const otpResponse = await this.dmlClient.post<{ success: boolean; otpToken: string }>('/b2b/auth/phone/request-otp', { headers: otpHeaders, data: otpData });
    const otpResponseData = otpResponse.data;

    if (!otpResponseData.success) {
      throw new Error('Failed to request OTP');
    }

    const verifyHeaders = {
      Authorization: `Bearer ${this.guestToken}`,
      'otp-token': `Bearer ${otpResponseData.otpToken}`,
      'device-id': this.deviceId,
      'Content-Type': 'application/json',
    };
    const verifyData = { otpCode: config.otpCode };

    const verifyResponse = await this.dmlClient.post<{ accessToken: string; refreshToken: string; userId: string }>('/b2b/auth/phone/verify-otp', { headers: verifyHeaders, data: verifyData });
    const verifyResponseData = verifyResponse.data;

    if (!verifyResponseData.accessToken) {
      throw new Error('Failed to verify OTP');
    }

    const userContext: B2BUserContext = {
      accessToken: verifyResponseData.accessToken,
      refreshToken: verifyResponseData.refreshToken,
      userId: verifyResponseData.userId,
      deviceId: this.deviceId,
      phone: userPhone,
    };

    return userContext;
  }
  getDefaultHeaders(userContext: B2BUserContext): Record<string, string> {
    const headers = {
      Authorization: `Bearer ${userContext.accessToken}`,
      'device-id': userContext.deviceId,
      'user-id': userContext.userId,
      'Content-Type': 'application/json',
    };

    return headers;
  }
  getGuestToken(): string {
    if (!this.guestToken) {
      throw new Error('Guest token not initialized. Call initialize() first.');
    }
    return this.guestToken;
  }
}
