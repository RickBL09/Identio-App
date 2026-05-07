import { MOCK_CREDENTIALS, MOCK_USER } from '@/mocks/data';
import type { User } from '@/types/domain';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export const AuthService = {
  async login(input: LoginInput): Promise<{ token: string; user: User }> {
    await sleep(500);

    if (
      input.email.toLowerCase() !== MOCK_CREDENTIALS.email ||
      input.password !== MOCK_CREDENTIALS.password
    ) {
      throw new Error('Credenciales invalidas. Usa demo@identio.app / Demo1234');
    }

    return {
      token: 'mock_jwt_token_identio',
      user: MOCK_USER,
    };
  },

  async register(input: RegisterInput): Promise<{ token: string; user: User }> {
    await sleep(600);

    return {
      token: 'mock_jwt_token_identio',
      user: {
        ...MOCK_USER,
        id: 'u_new',
        full_name: input.full_name,
        email: input.email.toLowerCase(),
        status: 'PENDING',
      },
    };
  },
};
