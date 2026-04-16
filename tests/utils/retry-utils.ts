// Типы
export interface SimpleRetryOptions {
  maxAttempts?: number;
  delay?: number;
  description?: string;
  validateResponse?: (response) => boolean | string; // true/false или сообщение об ошибке
}

export interface WaitForConditionOptions {
  timeout?: number;
  interval?: number;
  description?: string;
}

/**
  ретрай
 */
export async function simpleRetry<T>(operation: () => Promise<T>, options: SimpleRetryOptions = {}): Promise<T> {
  const { maxAttempts = 3, delay = 1000, description = 'operation', validateResponse } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();

      if (validateResponse) {
        const validationResult = validateResponse(result);

        if (validationResult !== true) {
          // Если вернули строку - это сообщение об ошибке
          const errorMessage = typeof validationResult === 'string' ? validationResult : 'Response validation failed';
          throw new Error(`[Validation] ${errorMessage}`);
        }
      }

      return result;
    } catch (error: any) {
      // Определяем тип ошибки (операция или валидация)
      const isValidationError = error.message?.includes('[Validation]');
      const errorType = isValidationError ? 'Validation' : 'Operation';

      if (attempt === maxAttempts) {
        console.log(`❌ ${description} ${errorType} failed after ${attempt} attempts:`, error.message);
        throw error;
      }

      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`🔄 ${description} ${errorType} attempt ${attempt} failed, retrying in ${waitTime}ms:`, error.message.replace('[Validation] ', ''));

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new Error('Should not reach here');
}

/**
 * УМНОЕ ОЖИДАНИЕ
 */
export async function waitForCondition(checkFn: () => Promise<boolean>, options?: WaitForConditionOptions): Promise<void> {
  const { timeout = 10000, interval = 500, description = 'condition' } = options;
  const start = Date.now();
  let attempts = 0;

  while (Date.now() - start < timeout) {
    attempts++;

    try {
      if (await checkFn()) {
        console.log(`✅ ${description} met after ${attempts} attempts`);
        return;
      }
    } catch (error) {
      // Игнорируем ошибки при проверке
    }

    const remaining = Math.min(interval, timeout - (Date.now() - start));
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
  }

  throw new Error(`${description} timeout after ${timeout}ms (${attempts} attempts)`);
}

/**
 * Хелпер для API (опционально)
 */
export async function retryApiCall<T>(apiCall: () => Promise<{ status: number; data: T }>, expectedStatus: number = 200): Promise<{ status: number; data: T }> {
  return simpleRetry(apiCall, {
    description: 'API call',
  }).then((response) => {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
    }
    return response;
  });
}
