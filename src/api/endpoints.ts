export const API_ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
  },
  biometric: {
    enroll: '/api/v1/embeddings/',
    verify: '/api/v1/verify/',
    attempts: '/api/v1/verify/attempts',
  },
  access: {
    nfcScan: '/access/nfc/scan',
  },
  audit: {
    list: '/audit/logs',
  },
} as const;
