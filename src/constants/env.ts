const asBool = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
  USE_MOCK_API: asBool(process.env.EXPO_PUBLIC_USE_MOCK_API, true),
};
