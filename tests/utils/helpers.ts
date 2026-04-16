import { wait } from './generators/data-generators';

export class ApiHelpers {
  static async retry<T>(operation: () => Promise<T>, maxAttempts: number = 3, delay: number = 1000): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        const isLastAttempt = attempt === maxAttempts;

        if (isLastAttempt) throw error;

        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await wait(delay);
      }
    }

    const error = new Error('All attempts failed');
    throw error;
  }

  static validateResponseSchema(response: any, expectedFields: string[]): void {
    for (const field of expectedFields) {
      const hasField = field in response;

      if (!hasField) {
        const error = new Error(`Missing field in response: ${field}`);
        throw error;
      }
    }
  }
}
