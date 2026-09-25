import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

export type TUserState = {
  user: TUser | null;
  /* Пока авторизация не проверена, защищённые маршруты не знают, показывать
     содержимое или отправлять на форму входа. */
  isAuthChecked: boolean;
  isLoading: boolean;
  authError: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  authError: null,
  updateUserError: null,
};

const saveTokens = (accessToken: string, refreshToken: string): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData): Promise<TUser> => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData): Promise<TUser> => {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async (): Promise<void> => {
  await logoutApi();
  removeTokens();
});

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (): Promise<TUser | null> => {
    if (!getCookie('accessToken')) return null;

    try {
      const { user } = await getUserApi();
      return user;
    } catch (error) {
      /* Токены больше не действуют — пользователя придётся авторизовать заново. */
      removeTokens();
      throw error;
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'user/requestPasswordReset',
  async (data: { email: string }): Promise<void> => {
    await forgotPasswordApi(data);
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }): Promise<void> => {
    await resetPasswordApi(data);
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>): Promise<TUser> => {
    const { user } = await updateUserApi(data);
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetAuthError: (state): void => {
      state.authError = null;
    },
  },
  extraReducers: (builder): void => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.error.message ?? 'Не удалось выполнить вход';
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.authError = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.authError = action.error.message ?? 'Не удалось отправить письмо';
      })
      .addCase(resetPassword.pending, (state) => {
        state.authError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.authError = action.error.message ?? 'Не удалось сменить пароль';
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError = action.error.message ?? 'Не удалось сохранить данные';
      });
  },
});

export const { resetAuthError } = userSlice.actions;

export const userReducer = userSlice.reducer;
