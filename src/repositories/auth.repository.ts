import { AuthApiService } from '@/services/auth.api.service';
import { TokenService } from '@/services/token.service';
import type { User, UserStatus } from '@/types/domain';
import type { LoginRequestDTO, RegisterRequestDTO } from '@/api/contracts';

// Helper to decode JWT and extract user info
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Helper to convert JWT payload to User object
function jwtToUser(payload: any): User {
  // Extract roles from JWT payload
  const roles = payload.roles || [];
  const roleObjects = Array.isArray(roles)
    ? roles.map((r: any) => ({
        id: r.id || 0,
        name: r.name || 'ROLE_USER',
      }))
    : [{ id: 1, name: 'ROLE_USER' as const }];

  return {
    id: payload.sub || '',
    full_name: payload.name || payload.full_name || '',
    email: payload.email || '',
    status: (payload.status || 'PENDING') as UserStatus,
    roles: roleObjects,
  };
}

export const AuthRepository = {
  async login(input: LoginRequestDTO) {
    try {
      console.log('[AuthRepository] Login attempt:', { email: input.email });
      
      console.log('[AuthRepository] Calling API login...');
      const response = await AuthApiService.login(input);
      console.log('[AuthRepository] API login response received');
      
      await TokenService.setTokens(response.access_token, response.refresh_token);
      
      // Decode JWT to get user info
      const payload = decodeJWT(response.access_token);
      const user = jwtToUser(payload);
      
      console.log('[AuthRepository] Login successful, user:', user.email);
      
      return {
        token: response.access_token,
        user,
      };
    } catch (error: any) {
      console.error('[AuthRepository] Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async register(input: RegisterRequestDTO) {
    const response = await AuthApiService.register(input);
    await TokenService.setTokens(response.access_token, response.refresh_token);
    
    // Decode JWT to get user info
    const payload = decodeJWT(response.access_token);
    const user = jwtToUser(payload);
    
    return {
      token: response.access_token,
      user,
    };
  },

  async refresh() {
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await AuthApiService.refresh({ refresh_token: refreshToken });
    await TokenService.setTokens(response.access_token, response.refresh_token);
    
    return response.access_token;
  },

  async logout() {
    await TokenService.clear();
  },

  async getToken() {
    return TokenService.getAccessToken();
  },
};
