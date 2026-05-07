import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export function useProfile() {
  const { auth, logout } = useAuthActions();
  return {
    user: auth.user,
    logout,
  };
}
