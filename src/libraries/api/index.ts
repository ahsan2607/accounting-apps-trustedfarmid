// ./src/libraries/api/index.ts (Next.js)
import axios, { AxiosError } from 'axios';
import { ApiResponse, Order, OperationalAccountingData, KategoriData, ProxyRequestBody, LoginData, TransferableAccount, LedgerData, ledgerAccounts } from '@/types';

const API_URL = '/api/proxy';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // For cookies
});

export const checkLogin = async (username: string, password: string): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await api.post<ApiResponse<LoginData>>('', {
      action: 'checkLogin',
      username,
      password,
    } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

// Remove isAuthenticated and logout

export const getCustomerList = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await api.post<ApiResponse<string[]>>('', { action: 'getCustomerList' } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getItemList = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await api.post<ApiResponse<string[]>>('', { action: 'getItemList' } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getAllLedgerAccounts = async (): Promise<ApiResponse<ledgerAccounts[]>> => {
  try {
    const response = await api.post<ApiResponse<ledgerAccounts[]>>('', { action: 'getAllLedgerAccounts' } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getAccountingCategoryData = async (account: string): Promise<ApiResponse<KategoriData>> => {
  try {
    const response = await api.post<ApiResponse<KategoriData>>('', { action: 'getAccountingCategoryData', account } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getAccountingTransferableAccounts = async (account: string): Promise<ApiResponse<TransferableAccount>> => {
  try {
    const response = await api.post<ApiResponse<TransferableAccount>>('', { action: 'getAccountingTransferableAccounts', account } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const submitOrders = async (deliveryDate: string, orders: Order[], sheet: string): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post<ApiResponse<string>>('', {
      action: 'submitOrders',
      deliveryDate,
      orders,
      sheet,
    } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const submitFormOperationalAccounting = async (
  account: string,
  entryDate: string,
  entries: OperationalAccountingData[],
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post<ApiResponse<string>>('', {
      action: 'submitFormOperationalAccounting',
      account,
      entryDate,
      entries,
    } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getLedgerData = async (sheet: string): Promise<ApiResponse<LedgerData[]>> => {
  try {
    const response = await api.post<ApiResponse<LedgerData[]>>('', {
      action: 'getLedgerData',
      sheet,
    } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

const handleError = <T>(error: unknown): ApiResponse<T> => {
  if (error instanceof AxiosError && error.response) {
    return { success: false, error: error.response.data.error || 'Server error' };
  }
  return { success: false, error: 'Network error' };
};

// // ./src/libraries/api/index.ts (next js)
// import axios, { AxiosError } from 'axios';
// import { ApiResponse, Order, OperationalAccountingData, KategoriData, LogoutResponse, ProxyRequestBody } from '@/types';

// const API_URL = '/api/proxy';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const checkLogin = async (username: string, password: string): Promise<ApiResponse<boolean>> => {
//   try {
//     const response = await api.post<ApiResponse<boolean>>('', {
//       action: 'checkLogin',
//       username,
//       password,
//     } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const isAuthenticated = async (): Promise<ApiResponse<boolean>> => {
//   try {
//     const response = await api.post<ApiResponse<boolean>>('', { action: 'isAuthenticated' } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
//   try {
//     const response = await api.post<ApiResponse<LogoutResponse>>('', { action: 'logout' } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const getCustomerList = async (): Promise<ApiResponse<string[]>> => {
//   try {
//     const response = await api.post<ApiResponse<string[]>>('', { action: 'getCustomerList' } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const getItemList = async (): Promise<ApiResponse<string[]>> => {
//   try {
//     const response = await api.post<ApiResponse<string[]>>('', { action: 'getItemList' } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const getKategoriData = async (): Promise<ApiResponse<KategoriData>> => {
//   try {
//     const response = await api.post<ApiResponse<KategoriData>>('', { action: 'getKategoriData' } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const submitOrders = async (deliveryDate: string, orders: Order[], sheet: string): Promise<ApiResponse<string>> => {
//   try {
//     const response = await api.post<ApiResponse<string>>('', {
//       action: 'submitOrders',
//       deliveryDate,
//       orders,
//       sheet,
//     } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// export const submitFormOperationalAccounting = async (
//   entryDate: string,
//   entries: OperationalAccountingData[],
//   sheetTarget?: string
// ): Promise<ApiResponse<string>> => {
//   try {
//     const response = await api.post<ApiResponse<string>>('', {
//       action: 'submitFormOperationalAccounting',
//       entryDate,       // 👈 optional batch-level date if needed
//       entries,       // 👈 array of multiple operationals
//       sheet: sheetTarget ?? '', // 👈 optional target sheet (like orders)
//     } satisfies ProxyRequestBody);
//     return response.data;
//   } catch (error: unknown) {
//     return handleError(error);
//   }
// };

// const handleError = <T>(error: unknown): ApiResponse<T> => {
//   if (error instanceof AxiosError && error.response) {
//     return { success: false, error: error.response.data.error || 'Server error' };
//   }
//   return { success: false, error: 'Network error' };
// };