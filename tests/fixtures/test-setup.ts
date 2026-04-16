import { test as base } from '@playwright/test';
import { B2CApiClient } from './api-clients/b2c-api-client';
import { B2cAuthContext, B2cGuestContext, B2cUserContext } from './b2c-auth-context';
import { B2BDmlClient } from './api-clients/b2b-dml-client';
import { B2BBffClient } from './api-clients/b2b-bff-client';
import { B2BAuthContext, B2BUserContext } from './b2b-auth-context';
import { TestUsersManager } from '../data/test-users';
import { DataGenerators } from '../utils/generators/data-generators';
import { DatabaseHelper } from './db';
import { Client } from 'pg';

export type B2CTestOptions = {
  apiClient: B2CApiClient;
  authContext: B2cAuthContext;
  testUser: B2cUserContext;
  freshB2CUser: B2cUserContext;
  guestUser: B2cGuestContext;
};

export type B2BTestOptions = {
  b2bDmlClient: B2BDmlClient;
  b2bBffClient: B2BBffClient;
  b2bAuthContext: B2BAuthContext;
  b2bTestUser: B2BUserContext;
  freshB2BUser: B2BUserContext;
  db: Client;
};

// Объединяем все фикстуры
export type AllTestOptions = B2CTestOptions & B2BTestOptions;

export const test = base.extend<AllTestOptions>({
  // ============ B2C ФИКСТУРЫ ============
  apiClient: async ({ request }, use) => {
    const apiClient = new B2CApiClient(request);
    await use(apiClient);
  },

  authContext: async ({ apiClient }, use) => {
    const authContext = new B2cAuthContext(apiClient);
    await use(authContext);
  },

  testUser: async ({ authContext }, use) => {
    const testUsersManager = TestUsersManager.getInstance();
    const testUser = await testUsersManager.getTestUserB2c(authContext);
    await use(testUser);
  },
  guestUser: async ({ authContext }, use) => {
    const guest = await authContext.getGuestUser();
    await use(guest);
  },
  // новый пользак на кажддый тест
  freshB2CUser: async ({ authContext }, use) => {
    console.log('👤 Creating fresh user...');

    const uniquePhone = DataGenerators.generatePhoneNumber();
    const newUser = await authContext.registerUser(uniquePhone);
    await use(newUser);
  },
  // ============ B2B ФИКСТУРЫ ============
  b2bDmlClient: async ({ request }, use) => {
    const dmlClient = new B2BDmlClient(request);
    await use(dmlClient);
  },

  b2bBffClient: async ({ request }, use) => {
    const bffClient = new B2BBffClient(request);
    await use(bffClient);
  },

  b2bAuthContext: async ({ b2bDmlClient, b2bBffClient }, use) => {
    const b2bAuthContext = new B2BAuthContext(b2bDmlClient, b2bBffClient);
    await use(b2bAuthContext);
  },

  b2bTestUser: async ({ b2bAuthContext }, use) => {
    const b2bTestUserManager = TestUsersManager.getInstance();
    const b2bTestUser = await b2bTestUserManager.getTestUserB2b(b2bAuthContext);

    await use(b2bTestUser);
  },

  //Фикстура бд-шки
  db: async ({}, use, testInfo) => {
    const dbHelper = DatabaseHelper.getInstance();

    try {
      // Просто передаем хелпер
      // @ts-ignore
      await use(dbHelper);

      // После теста можно почистить данные
      if (testInfo.status === 'passed') {
        // await dbHelper.cleanTestData();
      }
    } catch (error) {
      console.error('❌ Ошибка в фикстуре БД:', error);
      throw error;
    }
  },
});

export { expect } from '@playwright/test';
