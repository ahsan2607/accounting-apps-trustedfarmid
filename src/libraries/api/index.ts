// ./src/libraries/api/index.ts
import axios, { AxiosError } from 'axios';
import { ApiResponse, Order, OperationalAccountingData, KategoriData, LogoutResponse, ProxyRequestBody } from '@/types';

const API_URL = '/api/proxy';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkLogin = async (username: string, password: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>('', {
      action: 'checkLogin',
      username,
      password,
    } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
  try {
    const response = await api.post<ApiResponse<LogoutResponse>>('', { action: 'logout' } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

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

export const getKategoriData = async (): Promise<ApiResponse<KategoriData>> => {
  try {
    const response = await api.post<ApiResponse<KategoriData>>('', { action: 'getKategoriData' } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const submitOrders = async (deliveryDate: string, orders: Order[]): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post<ApiResponse<string>>('', {
      action: 'submitOrders',
      deliveryDate,
      orders,
    } satisfies ProxyRequestBody);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const submitFormOperationalAccounting = async (
  data: OperationalAccountingData
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post<ApiResponse<string>>('', {
      action: 'submitFormOperationalAccounting',
      tanggal: data.tanggal,
      nominal: data.nominal,
      keterangan: data.keterangan,
      // kategori is derived on the backend
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