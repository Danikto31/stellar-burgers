import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';
import { setCookie, getCookie } from './cookie';

import type { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(toApiError(err)));

type TServerResponse<T = unknown> = {
  success: boolean;
} & T;

/**
 * The API signals failure with a JSON payload rather than an HTTP error, so the
 * payload is wrapped in a real Error before rejecting. The original body is
 * kept in `cause` for debugging.
 */
const toApiError = (payload: unknown): Error => {
  const message =
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as { message: unknown }).message === 'string'
      ? (payload as { message: string }).message
      : 'Не удалось выполнить запрос к серверу';

  return new Error(message, { cause: payload });
};

type TTokens = {
  refreshToken: string;
  accessToken: string;
};

type TRefreshResponse = TServerResponse<TTokens>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem(REFRESH_TOKEN_KEY),
    }),
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(toApiError(refreshData));
      }
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshData.refreshToken);
      setCookie(ACCESS_TOKEN_KEY, refreshData.accessToken);
      return refreshData;
    });

/* Это предпочтительны способ обновления токена, но допустимы и другие, главное,
что бы обновление токена работало корректно */
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as Record<string, string>).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(toApiError(err));
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<TOrdersData>;

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(toApiError(data));
    });

export const getFeedsApi = (): Promise<TFeedsResponse> =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(toApiError(data));
    });

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie(ACCESS_TOKEN_KEY),
    } as HeadersInit,
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(toApiError(data));
  });

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]): Promise<TNewOrderResponse> =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie(ACCESS_TOKEN_KEY),
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data,
    }),
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(toApiError(data));
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number): Promise<TOrderResponse> =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<TTokens & { user: TUser }>;

export const registerUserApi = (data: TRegisterData): Promise<TAuthResponse> =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(toApiError(data));
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(toApiError(data));
    });

export type TForgotPasswordData = Pick<TLoginData, 'email'>;

export const forgotPasswordApi = (data: TForgotPasswordData): Promise<TServerResponse> =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TServerResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(toApiError(data));
    });

export type TResetPasswordData = Pick<TLoginData, 'password'> & {
  token: string;
};

export const resetPasswordApi = (data: TResetPasswordData): Promise<TServerResponse> =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TServerResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(toApiError(data));
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie(ACCESS_TOKEN_KEY),
    } as HeadersInit,
  });

export const updateUserApi = (user: Partial<TRegisterData>): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie(ACCESS_TOKEN_KEY),
    } as HeadersInit,
    body: JSON.stringify(user),
  });

export const logoutApi = (): Promise<TServerResponse> =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      token: localStorage.getItem(REFRESH_TOKEN_KEY),
    }),
  }).then((res) => checkResponse<TServerResponse>(res));
