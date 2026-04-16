export class Config {
  private static instance: Config;
  public readonly b2cBaseURL: string;
  public readonly b2bBaseURL: string;
  public readonly b2bBffBaseURL: string;
  public readonly timeout: number;
  public readonly otpCode: string;

  private constructor() {
    this.b2cBaseURL = process.env.B2C_BASE_URL || 'https://staging.presale.ru';
    this.b2bBaseURL = process.env.B2B_BASE_URL || 'https://dml.staging.presale.ru';
    this.b2bBffBaseURL = process.env.B2B_BFF_BASE_URL || 'https://bff.b2b.staging.presale.ru';
    this.timeout = process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT) : 30000;
    this.otpCode = process.env.TEST_OTP_CODE || '1234';
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

// Экспортируем инстанс для удобства
export const config = Config.getInstance();
