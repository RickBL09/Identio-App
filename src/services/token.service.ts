import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'identio_access_token';

export const TokenService = {
  async set(token: string) {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },
  async get() {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(TOKEN_KEY);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return null;
    } else {
      return SecureStore.getItemAsync(TOKEN_KEY);
    }
  },
  async clear() {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },
};
