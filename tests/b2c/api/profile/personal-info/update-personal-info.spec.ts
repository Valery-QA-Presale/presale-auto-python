import { test, expect } from '../../../../fixtures/test-setup';
import { TestDataGenerator } from '../../../../data/test-data';
import { PersonalInfoValidator } from '../../../../utils/validators/profile/personal-info.validator';
import { ENDPOINTS } from '../../../../data/constants/index';
import { SuccessResponse } from '../../../../fixtures/api-clients/b2c-api-client';
import { simpleRetry } from '../../../../utils/retry-utils';

test.describe.configure({ mode: 'serial' });

test.describe('Update Personal Info API', () => {
  test('update personal info with valid data', async ({ apiClient, testUser, authContext }) => {
    const newFirstName = TestDataGenerator.generateFirstName();
    const newLastName = TestDataGenerator.generateLastName();
    const newBirthDate = TestDataGenerator.generateBirthDate(); // "1999-07-07" (ISO)

    const [year, month, day] = newBirthDate.split('-');
    const expectedBirthDate = `${day}.${month}.${year}`; // "07.07.1999"

    const updateData = {
      firstName: newFirstName,
      lastName: newLastName,
      birthDate: newBirthDate, // преобразованная дата
    };

    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.post(ENDPOINTS.PROFILE.POST.SAVE_PERSONAL_DATA, {
      headers,
      data: updateData,
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('success', true);

    const getResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, { headers });
        if (resp.status !== 200) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
      },
    );
    expect(getResponse.status).toBe(200);
    // @ts-ignore
    expect(getResponse.data.firstName.value).toBe(newFirstName);
    // @ts-ignore
    expect(getResponse.data.lastName.value).toBe(newLastName);
    // @ts-ignore
    expect(getResponse.data.birthDate.value).toBe(expectedBirthDate);

    //  Проверяю структуру
    PersonalInfoValidator.validate(getResponse.data);
  });

  test('should update firstName', async ({ apiClient, testUser, authContext }) => {
    const newFirstName = 'Измененное';
    const updateData = { firstName: newFirstName };
    const headers = authContext.getDefaultHeaders(testUser);

    // 1. Обновляем
    const response = await apiClient.post('/profile/personal-data/save', {
      headers,
      data: updateData,
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('success', true);

    const getResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, { headers });
        if (resp.status !== 200) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
      },
    );
    expect(getResponse.status).toBe(200);
    // @ts-ignore
    expect(getResponse.data.firstName.value).toBe(newFirstName);
    //  Проверяю структуру
    PersonalInfoValidator.validate(getResponse.data);
  });

  test('should update lastName', async ({ apiClient, testUser, authContext }) => {
    const newLastName = 'IvanovTestov';
    const updateData = { lastName: newLastName };
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.post(ENDPOINTS.PROFILE.POST.SAVE_PERSONAL_DATA, {
      headers,
      data: updateData,
    });

    const responseStatus = response.status;
    const responseData = response.data;
    expect(responseStatus).toBe(201);
    expect(responseData).toHaveProperty('success', true);

    const getResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, { headers });
        if (resp.status !== 200) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
      },
    );
    expect(getResponse.status).toBe(200);
    // @ts-ignore
    expect(getResponse.data.lastName.value).toBe(newLastName);

    //  Проверяю структуру
    PersonalInfoValidator.validate(getResponse.data);
  });

  test('should update birthDate', async ({ apiClient, testUser, authContext }) => {
    const isoBirthDate = '1995-05-15';

    // преобразую формат
    const [year, month, day] = isoBirthDate.split('-');
    const expectedBirthDate = `${day}.${month}.${year}`; // "15.05.1995"
    const updateData = { birthDate: isoBirthDate };
    const headers = authContext.getDefaultHeaders(testUser);

    const response = await apiClient.post(ENDPOINTS.PROFILE.POST.SAVE_PERSONAL_DATA, {
      headers,
      data: updateData,
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('success', true);

    const getResponse = await simpleRetry(
      async () => {
        // @ts-ignore
        const resp = await apiClient.get<SuccessResponse>(ENDPOINTS.PROFILE.GET.PERSONAL_INFO, { headers });
        if (resp.status !== 200) {
          throw new Error(`Expected status 201, got ${resp.status}`);
        }
        return resp;
      },
      {
        maxAttempts: 3,
        delay: 1000,
      },
    );
    const responseStatus = getResponse.status;
    expect(responseStatus).toBe(200);
    // что бы TS не ругался
    const responseData = getResponse.data as any;

    expect(responseData.birthDate.value).toBe(expectedBirthDate);
    expect(responseData.birthDate.value).toMatch(/^\d{2}\.\d{2}\.\d{4}$/); // DD.MM.YYYY
    expect(responseData.birthDate.placeholder).toBe('дд.мм.гггг');

    PersonalInfoValidator.validate(getResponse.data);
  });
});

test.describe('Negative scenarios ', () => {
  test('should return 401 without authorization', async ({ apiClient }) => {
    const updateData = { firstName: 'Иван', lastName: 'Тестов' };
    const headers = { 'Content-Type': 'application/json' };
    const requestOptions = { headers: headers, data: updateData };

    const response = await apiClient.post(ENDPOINTS.PROFILE.POST.SAVE_PERSONAL_DATA, requestOptions);
    const responseStatus = response.status;

    expect(responseStatus).toBe(401);
  });

  test('should validate birthDate format', async ({ apiClient, authContext, testUser }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const updateData = { birthDate: 'invalid-date' };
    const requestOptions = { headers: headers, data: updateData };

    const response = await apiClient.post(ENDPOINTS.PROFILE.POST.SAVE_PERSONAL_DATA, requestOptions);
    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
  });
});
