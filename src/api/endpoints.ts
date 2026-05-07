export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  biometric: {
    enroll: '/biometric/enroll',
    verify: '/biometric/verify',
  },
  access: {
    nfcScan: '/access/nfc/scan',
  },
  audit: {
    list: '/audit/logs',
  },
} as const;
