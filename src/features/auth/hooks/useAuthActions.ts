import { useAppDispatch, useAppSelector } from '@/store';
import { clearError, initializeAuthThunk, loginThunk, logoutThunk, registerThunk } from '@/store/slices/authSlice';

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    auth,
    initializeAuth: () => dispatch(initializeAuthThunk()),
    login: (email: string, password: string) => dispatch(loginThunk({ email, password })),
    register: (full_name: string, email: string, password: string) =>
      dispatch(registerThunk({ full_name, email, password })),
    logout: () => dispatch(logoutThunk()),
    clearError: () => dispatch(clearError()),
  };
}
