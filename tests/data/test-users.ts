import { B2cAuthContext, B2cUserContext } from '../fixtures/b2c-auth-context';
import { B2BAuthContext, B2BUserContext } from '../fixtures/b2b-auth-context';

export class TestUsersManager {
  private static instance: TestUsersManager;
  private cachedB2cTestUser: B2cUserContext | null = null;
  private cachedB2bTestUser: B2BUserContext | null = null;

  public static getInstance(): TestUsersManager {
    if (!TestUsersManager.instance) {
      TestUsersManager.instance = new TestUsersManager();
    }
    return TestUsersManager.instance;
  }

  async getTestUserB2c(authContext: B2cAuthContext): Promise<B2cUserContext> {
    if (!this.cachedB2cTestUser) {
      this.cachedB2cTestUser = await authContext.registerUser('+79001234567');
    }
    return this.cachedB2cTestUser;
  }

  async getTestUserB2b(authContext: B2BAuthContext): Promise<B2BUserContext> {
    if (!this.cachedB2bTestUser) {
      this.cachedB2bTestUser = await authContext.registerUser('+79991234567');
    }
    return this.cachedB2bTestUser;
  }
}
