import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'identio_access_token';

export const TokenService = {
  async set(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async get() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async clear() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
