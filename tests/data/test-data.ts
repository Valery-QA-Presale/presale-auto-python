import { DataGenerators } from '../utils/generators/data-generators';
import { ResponseValidators } from '../utils/validators';

export { DataGenerators, ResponseValidators };

export class TestDataGenerator {
  static generatePhoneNumber(): string {
    return DataGenerators.generatePhoneNumber();
  }

  static generateDeviceId(): string {
    return DataGenerators.generateDeviceId();
  }

  static generateFirstName(): string {
    return DataGenerators.generateFirstName();
  }

  static generateLastName(): string {
    return DataGenerators.generateLastName();
  }

  static generateBirthDate(): string {
    return DataGenerators.generateBirthDate();
  }

  static generateEmail(): string {
    return DataGenerators.generateEmail();
  }

  static generateAddress(): any {
    return DataGenerators.generateAddress();
  }

  static generateRUSIndividualEntrepreneurShop(): any {
    return DataGenerators.generateRUSIndividualEntrepreneurShop();
  }

  static generateRUSelfEmployedShop(): any {
    return DataGenerators.generateRUSelfEmployedShop();
  }
  static generateRandomShopData(): any {
    return DataGenerators.generateRandomShopData();
  }

  static generateRULLCShop(): any {
    return DataGenerators.generateRULLCShop();
  }

  static generateOtherShop(): any {
    return DataGenerators.generateOtherShop();
  }

  static validatePhone(phone: string): boolean {
    return ResponseValidators.validatePhone(phone);
  }
}
