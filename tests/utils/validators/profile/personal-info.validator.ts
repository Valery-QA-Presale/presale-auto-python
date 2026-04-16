import { expect } from '@playwright/test';

export class PersonalInfoValidator {
  static validate(data: any): void {
    this.validateValues(data);
  }

  private static validateValues(data: any): void {
    // ========== TITLE ==========
    expect(data.title).toBe('Личные данные');

    // ========== FIRST NAME ==========
    expect(data.firstName).toBeDefined();
    expect(data.firstName.placeholder).toBe('');
    expect(data.firstName.label).toBe('Имя');
    expect(data.firstName.value).toMatch(/^[A-Za-zА-Яа-я]+$/);
    expect(Array.isArray(data.firstName.validate)).toBe(true);

    // ========== LAST NAME ==========
    expect(data.lastName).toBeDefined();
    expect(data.lastName.placeholder).toBe('');
    expect(data.lastName.label).toBe('Фамилия');
    expect(data.lastName.value).toMatch(/^[A-Za-zА-Яа-я]+$/);
    expect(Array.isArray(data.lastName.validate)).toBe(true);

    // ========== BIRTH DATE ==========
    expect(data.birthDate).toBeDefined();
    expect(data.birthDate.placeholder).toBe('дд.мм.гггг');
    expect(data.birthDate.label).toBe('Дата рождения');
    expect(data.birthDate.value).toBeDefined();
    // Проверка формата даты (дд.мм.гггг)
    expect(data.birthDate.value).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    expect(Array.isArray(data.birthDate.validate)).toBe(true);

    // ========== PHONE ==========
    expect(data.phone).toBeDefined();
    expect(data.phone.placeholder).toBe('');
    expect(data.phone.label).toBe('Номер телефона');
    expect(data.phone.value).toBeDefined();
    // Проверка формата телефона
    expect(data.phone.value).toMatch(/^\+7\d{10}$/);
    expect(Array.isArray(data.phone.validate)).toBe(true);

    // ========== EMAIL ==========
    expect(data.email).toBeDefined();
    expect(data.email.placeholder).toBe('');
    expect(data.email.label).toBe('E-mail');
    expect(data.email.value).toBeDefined();
    // Может быть пустым, но поле должно быть
    expect(Array.isArray(data.email.validate)).toBe(true);

    // ========== PRIMARY BUTTON ==========
    expect(data.primaryButton).toBeDefined();
    expect(data.primaryButton.title).toBe('Сохранить');
    expect(data.primaryButton.deeplink).toBe('https://ya.ru');
    expect(data.primaryButton.iconName).toBe('');

    // ========== SUPPORT BUTTON ==========
    expect(data.supportButton).toBeDefined();
    expect(data.supportButton.deeplink).toBe('presale-app://app/support');
    expect(data.supportButton.iconName).toBe('help-fill');
    expect(data.supportButton.title).toBe('Номер телефона используется для\nвхода в приложение. Если хотите его\nпоменять — свяжитесь с поддержкой');
    expect(data.supportButton.markdownText).toBe('Обратиться в поддержку');

    // Проверка action
    expect(data.supportButton.action).toBeDefined();
    expect(data.supportButton.action.type).toBe('call');
    expect(data.supportButton.action.phoneNumber).toBe('+78001234567');

    // ========== POLICY MARKDOWN ==========
    expect(data.policyMarkdownText).toBe('Нажимая кнопку “Сохранить”, я даю согласие на обработку своих персональных данных в соответствии с [политикой обработки персональных данных](https://ya.ru)');
  }
}
