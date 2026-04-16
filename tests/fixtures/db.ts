import { Client } from 'pg';

export class DatabaseHelper {
  private static instance: DatabaseHelper;
  private client: Client | null = null;

  static getInstance(): DatabaseHelper {
    if (!DatabaseHelper.instance) {
      DatabaseHelper.instance = new DatabaseHelper();
    }
    return DatabaseHelper.instance;
  }

  async connect() {
    if (this.client) return this.client;

    this.client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'presale_auth_b2b',
      user: 'postgres',
      password: 'Oineipei7Eeshu6noose',
    });

    await this.client.connect();
    return this.client;
  }

  async query(sql: string, params?: any[]) {
    const client = await this.connect();
    return client.query(sql, params);
  }

  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  // Хелпер методы для тестов
  async getApplicationByRegistrationId(registrationId: string) {
    return this.query(`SELECT * FROM applications WHERE "registrationId" = $1`, [registrationId]);
  }

  async deleteTestApplications() {
    return this.query(`
      DELETE FROM applications 
      WHERE "email" LIKE '%@test.ru' 
         OR "shopName" LIKE 'Автотестовый Магазин%'
    `);
  }

  async cleanTestData(userId?: string) {
    if (userId) {
      await this.query(`DELETE FROM applications WHERE "accountId" = $1`, [userId]);
    } else {
      await this.deleteTestApplications();
    }
  }
}
