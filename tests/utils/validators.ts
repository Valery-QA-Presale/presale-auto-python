export class ResponseValidators {
  // базовые валидации
  static validateSuccessResponse(response: any): void {
    if (!response || typeof response !== 'object') {
      throw new Error('Response is not a valid object');
    }

    // Проверяем статус успеха
    if (response.success !== undefined && !response.success) {
      throw new Error(`Request failed: ${response.message || 'Unknown error'}`);
    }

    // Проверяем HTTP статус код
    if (response.status && response.status >= 400) {
      throw new Error(`HTTP Error ${response.status}: ${response.data?.message || 'Unknown error'}`);
    }
  }

  static validateResponseSchema(response: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  // Валидация ответов
  static validateAuthResponse(response: any): void {
    this.validateResponseSchema(response, ['accessToken', 'refreshToken', 'userId']);

    if (typeof response.accessToken !== 'string' || !response.accessToken) {
      throw new Error('Invalid access token in response');
    }

    if (typeof response.refreshToken !== 'string' || !response.refreshToken) {
      throw new Error('Invalid refresh token in response');
    }

    if (typeof response.userId !== 'string' || !response.userId) {
      throw new Error('Invalid user ID in response');
    }
  }

  static validateProfileResponse(response: any): void {
    this.validateResponseSchema(response, ['firstName', 'lastName', 'phone']);

    if (response.firstName && typeof response.firstName.value !== 'string') {
      throw new Error('Invalid firstName format in profile response');
    }

    if (response.phone && typeof response.phone.value !== 'string') {
      throw new Error('Invalid phone format in profile response');
    }
  }

  static validateAddressResponse(response: any): void {
    this.validateResponseSchema(response, ['address', 'apartment']);

    if (typeof response.address !== 'string') {
      throw new Error('Invalid address format');
    }

    if (typeof response.apartment !== 'string' && typeof response.apartment !== 'number') {
      throw new Error('Invalid apartment format');
    }
  }

  // ========== ВАЛИДАЦИИ ДАННЫХ ==========
  static validatePhone(phone: string): boolean {
    const russianPhoneRegex = /^\+79\d{9}$/;
    return russianPhoneRegex.test(phone);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
