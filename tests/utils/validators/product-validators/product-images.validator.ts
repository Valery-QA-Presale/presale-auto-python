import { expect } from '@playwright/test';

export class ProductImagesValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    expect(Array.isArray(data.photoSections)).toBe(true);
    expect(data.photoSections.length).toBeGreaterThanOrEqual(3);

    const requiredTypes = ['cover', 'photo', 'label'];
    const foundTypes = data.photoSections.map((s: any) => s.type);

    requiredTypes.forEach((type) => {
      expect(foundTypes).toContain(type);
    });

    data.photoSections.forEach((section: any) => {
      expect(section.title).toBeDefined();
      expect(section.photosMaxCount).toBeGreaterThan(0);
      expect(section.icons.addIconName).toBe('camera');
      expect(section.icons.deleteIconName).toBe('close-round-blue');
      expect(section.description).toBeDefined();
      expect(section.description.length).toBeGreaterThan(0);
      expect(section.photosGuideButton.title).toBeDefined();
      expect(section.photosGuideButton.title.length).toBeGreaterThan(0);
      expect(section.photosGuideButton.deeplink).toBe('');
      expect(Array.isArray(section.medias)).toBe(true);
      expect(section.medias.length).toBe(0);
      expect(section.type).toBeDefined();
    });

    expect(data.primaryButton.title).toBe('Продолжить');
    expect(data.primaryButton.deeplink).toMatch(/^presale-app:\/\//);
    expect(data.saveButton.title).toBe('Сохранить и выйти');
    expect(data.saveButton.deeplink).toBe('');
  }
}
