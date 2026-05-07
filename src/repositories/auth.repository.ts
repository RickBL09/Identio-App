import { AuthService, type LoginInput, type RegisterInput } from '@/services/auth.service';
import { AuthApiService } from '@/services/auth.api.service';
import { TokenService } from '@/services/token.service';
import { ENV } from '@/constants/env';

export const AuthRepository = {
  async login(input: LoginInput) {
    const response = ENV.USE_MOCK_API
      ? await AuthService.login(input)
      : await AuthApiService.login(input);
    await TokenService.set(response.token);
    return response;
  },

  async register(input: RegisterInput) {
    const response = ENV.USE_MOCK_API
      ? await AuthService.register(input)
      : await AuthApiService.register(input);
    await TokenService.set(response.token);
    return response;
  },

  async logout() {
    await TokenService.clear();
  },

  async getToken() {
    return TokenService.get();
  },
};
