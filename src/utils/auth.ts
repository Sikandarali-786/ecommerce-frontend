import type { User } from '../types';

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};

export const logout = (): void => {
  removeToken();
  removeUser();
};

const LOGIN_LOCK_PREFIX = 'login-lock:';

export interface LoginLockState {
  email: string;
  lockedUntil: number;
  label?: string;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const getLoginLock = (email: string): LoginLockState | null => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const raw = localStorage.getItem(`${LOGIN_LOCK_PREFIX}${normalizedEmail}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LoginLockState;
    if (parsed?.label === 'rate-limit') {
      localStorage.removeItem(`${LOGIN_LOCK_PREFIX}${normalizedEmail}`);
      return null;
    }

    if (!parsed?.lockedUntil || parsed.lockedUntil <= Date.now()) {
      localStorage.removeItem(`${LOGIN_LOCK_PREFIX}${normalizedEmail}`);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(`${LOGIN_LOCK_PREFIX}${normalizedEmail}`);
    return null;
  }
};

export const setLoginLock = (
  email: string,
  lockedUntil: number,
  label?: string,
): void => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return;

  const state: LoginLockState = {
    email: normalizedEmail,
    lockedUntil,
    label,
  };

  localStorage.setItem(`${LOGIN_LOCK_PREFIX}${normalizedEmail}`, JSON.stringify(state));
};

export const clearLoginLock = (email: string): void => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return;

  localStorage.removeItem(`${LOGIN_LOCK_PREFIX}${normalizedEmail}`);
};
