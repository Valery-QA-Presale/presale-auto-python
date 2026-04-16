export const AUTH_ENDPOINTS = {
  POST: {
    GUEST_TOKEN: '/auth/guest-token',
    REQUEST_OTP: '/auth/registration/request-otp',
    VERIFY_OTP: '/auth/registration/verify-otp',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  GET: {
    SCREEN_AUTH: '/screen/auth',
    SCREEN_OTP: '/screen/otp',
  },
} as const;
