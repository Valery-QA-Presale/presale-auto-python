import { test, expect } from '../../../../../fixtures/test-setup';
import { TestDataGenerator } from '../../../../../data/test-data';
import { config } from '../../../../../../config/config';

test.describe('Email Verification Flow', () => {
  test.describe.configure({ mode: 'serial' });

  let testEmail: string;
  let otpToken: string;

  test('should get email verification screen data', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const requestOptions = { headers: headers };

    const response = await apiClient.get('/screen/profile/email', requestOptions);
    const responseStatus = response.status;
    const responseData = response.data;

    expect(responseStatus).toBe(200);
    expect(responseData).toBeDefined();
  });
  // TODO: 23.03.2026 - Не рабочий имейл, необходимо дописать тесты

  test('should send verification code to email', async ({ apiClient, testUser, authContext }) => {
    testEmail = TestDataGenerator.generateEmail();
    const headers = authContext.getDefaultHeaders(testUser);
    const requestData = { email: testEmail, checkboxMarketing: true };
    const requestOptions = { headers: headers, data: requestData };

    const response = await apiClient.post('/profile/email-verifications', requestOptions);
    const responseStatus = response.status;
    const responseData = response.data;

    const logData = { status: responseStatus, data: responseData };

    expect([200, 201]).toContain(responseStatus);
    expect(responseData).toBeDefined();

    // @ts-ignore
    otpToken = responseData.otpToken as string;
    expect(otpToken).toBeDefined();
  });

  test('should verify email with valid OTP code', async ({ apiClient, testUser, authContext }) => {
    if (!testEmail || !otpToken) throw new Error('testEmail or otpToken is undefined');

    const validOtpCode = config.otpCode;
    const headers = authContext.getDefaultHeaders(testUser);
    const verifyHeaders = { ...headers, 'otp-token': `Bearer ${otpToken}` };
    const requestData = { otpCode: validOtpCode };
    const requestOptions = { headers: verifyHeaders, data: requestData };

    const headersLog = { 'otp-token': verifyHeaders['otp-token']?.substring(0, 30) + '...' };
    const verifyResponse = await apiClient.post('/profile/verify/email-otp', requestOptions);
    const verifyStatus = verifyResponse.status;
    const verifyData = verifyResponse.data;

    const resultLog = { status: verifyStatus, data: verifyData };

    expect([200, 201]).toContain(verifyStatus);
    expect(verifyData).toBeDefined();
  });
});

test.describe('Negative Email Verification Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test('should fail with invalid OTP code', async ({ apiClient, testUser, authContext }) => {
    const testEmail = TestDataGenerator.generateEmail();
    const headers = authContext.getDefaultHeaders(testUser);
    const requestData = { email: testEmail, checkboxMarketing: true };
    const requestOptions = { headers: headers, data: requestData };

    const requestResponse = await apiClient.post('/profile/email-verifications', requestOptions);
    const requestStatus = requestResponse.status;

    if (requestStatus !== 200 && requestStatus !== 201) {
      console.log('️ Cannot test - code request failed');
      return;
    }

    // @ts-ignore
    const otpToken = requestResponse.data.otpToken as string;
    if (!otpToken) {
      console.log(' No OTP token received');
      return;
    }

    const verifyHeaders = { ...headers, 'otp-token': `Bearer ${otpToken}` };
    const verifyData = { otpCode: '9999' };
    const verifyOptions = { headers: verifyHeaders, data: verifyData };

    const verifyResponse = await apiClient.post('/profile/verify/email-otp', verifyOptions);
    const verifyStatus = verifyResponse.status;
    const verifyResponseData = verifyResponse.data;

    const responseLog = { status: verifyStatus, data: verifyResponseData };
    console.log('Invalid OTP code response:', responseLog);

    expect([400, 422]).toContain(verifyStatus);
    expect(verifyResponseData).toHaveProperty('message');
  });

  test('should fail with invalid email formats', async ({ apiClient, testUser, authContext }) => {
    const headers = authContext.getDefaultHeaders(testUser);
    const invalidEmails = ['not-an-email', 'invalid@', '@no-domain.com', 'spaces in@email.com', 'toolongemail@' + 'a'.repeat(250) + '.com', '', 'null', 'undefined'];

    for (const invalidEmail of invalidEmails) {
      const requestData = { email: invalidEmail, checkboxMarketing: true };
      const requestOptions = { headers: headers, data: requestData };

      const response = await apiClient.post('/profile/email-verifications', requestOptions);
      const responseStatus = response.status;
      const responseData = response.data;

      const logData = { status: responseStatus, data: responseData };

      expect([400, 422]).toContain(responseStatus);
    }
  });

  test('should fail without authorization', async ({ apiClient, testUser }) => {
    const testEmail = TestDataGenerator.generateEmail();
    const headers = { 'Content-Type': 'application/json' };
    const requestData = { email: testEmail, checkboxMarketing: true };
    const requestOptions = { headers: headers, data: requestData };

    const response = await apiClient.post('/profile/email-verifications', requestOptions);
    const responseStatus = response.status;
    const responseData = response.data;

    const logData = { status: responseStatus, data: responseData };
    console.log('No authorization response:', logData);

    expect(responseStatus).toBe(401);
  });

  test('should fail with empty OTP code', async ({ apiClient, testUser, authContext }) => {
    const testEmail = TestDataGenerator.generateEmail();
    const headers = authContext.getDefaultHeaders(testUser);
    const requestData = { email: testEmail, checkboxMarketing: true };
    const requestOptions = { headers: headers, data: requestData };

    const requestResponse = await apiClient.post('/profile/email-verifications', requestOptions);
    const requestStatus = requestResponse.status;
    if (requestStatus !== 200 && requestStatus !== 201) return;

    // @ts-ignore
    const otpToken = requestResponse.data.otpToken as string;
    if (!otpToken) return;

    const verifyHeaders = { ...headers, 'otp-token': `Bearer ${otpToken}` };
    const verifyData = { otpCode: '' };
    const verifyOptions = { headers: verifyHeaders, data: verifyData };

    const verifyResponse = await apiClient.post('/profile/verify/email-otp', verifyOptions);
    const verifyStatus = verifyResponse.status;
    const verifyResponseData = verifyResponse.data;

    const logData = { status: verifyStatus, data: verifyResponseData };
    console.log(' Empty OTP code response:', logData);

    expect([400, 422]).toContain(verifyStatus);
  });
});
