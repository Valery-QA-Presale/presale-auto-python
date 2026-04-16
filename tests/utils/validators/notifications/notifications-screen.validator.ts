import { expect } from '@playwright/test';

export class NotificationsScreenValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Уведомления');

    // ========== PUSH ==========
    expect(data.push).toBeDefined();
    expect(data.push.title).toBe('Push');
    expect(data.push.isActive).toBeDefined();
    expect(typeof data.push.isActive).toBe('boolean');
    // isActive может быть true/false в зависимости от настроек

    // ========== EMAIL ==========
    expect(data.email).toBeDefined();
    expect(data.email.title).toBe('Email');
    expect(data.email.isActive).toBeDefined();
    expect(typeof data.email.isActive).toBe('boolean');

    // ========== ADD BUTTON (внутри email) ==========
    expect(data.email.addButton).toBeDefined();
    expect(data.email.addButton.title).toBe('Указать email');
    expect(data.email.addButton.text).toBe('В личных данных отсутствует email, укажите его чтобы мы могли отправлять вам уведомления');
    expect(typeof data.email.addButton.deeplink).toBe('string');
    expect(data.email.addButton.deeplink.length).toBeGreaterThan(0);
    expect(data.email.addButton.deeplink).toMatch(/^presale-app:\/\/.+/);
  }
}
