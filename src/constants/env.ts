const asBool = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080',
  USE_MOCK_API: asBool(process.env.EXPO_PUBLIC_USE_MOCK_API, true),
};

// Debug: Log environment variables on load
console.log('[ENV] Configuration loaded:', {
  API_BASE_URL: ENV.API_BASE_URL,
  USE_MOCK_API: ENV.USE_MOCK_API,
  raw_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  raw_USE_MOCK_API: process.env.EXPO_PUBLIC_USE_MOCK_API,
});
