import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'identio_access_token';
const REFRESH_TOKEN_KEY = 'identio_refresh_token';

export const TokenService = {
  async setAccessToken(token: string) {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(ACCESS_TOKEN_KEY, token);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    }
  },

  async getAccessToken() {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return null;
    } else {
      return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }
  },

  async setRefreshToken(token: string) {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(REFRESH_TOKEN_KEY, token);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    }
  },

  async getRefreshToken() {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(REFRESH_TOKEN_KEY);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return null;
    } else {
      return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    }
  },

  async setTokens(accessToken: string, refreshToken: string) {
    await this.setAccessToken(accessToken);
    await this.setRefreshToken(refreshToken);
  },

  async clear() {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  },

  // Backward compatibility - alias for getAccessToken
  async get() {
    return this.getAccessToken();
  },

  // Backward compatibility - alias for setAccessToken
  async set(token: string) {
    return this.setAccessToken(token);
  },
};
