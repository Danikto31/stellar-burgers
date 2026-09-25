import type { RootState } from '@services/store';
import type { TUser } from '@utils-types';

export const selectUser = (state: RootState): TUser | null => state.user.user;

export const selectUserName = (state: RootState): string | undefined =>
  state.user.user?.name;

export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const selectAuthError = (state: RootState): string | undefined =>
  state.user.authError ?? undefined;

export const selectUpdateUserError = (state: RootState): string | undefined =>
  state.user.updateUserError ?? undefined;
