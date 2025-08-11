export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Order {
  customer: string;
  item: string;
  qty: string;
}

export interface OperationalAccountingData {
  tanggal: string;
//   kategori: string;
  nominal: string;
  keterangan: string;
}

export interface KategoriData {
  [subCategory: string]: string; // Maps subCategory to COA ID
}

export interface LogoutResponse {
  message: string;
}

// Type for proxy request body (matches Apps Script doPost input)
export interface ProxyRequestBody {
  action: 'checkLogin' | 'logout' | 'getCustomerList' | 'getItemList' | 'submitOrders' | 'submitFormOperationalAccounting' | 'getKategoriData' | 'generateLedger' | 'printInvoiceToPDF';
  username?: string;
  password?: string;
  deliveryDate?: string;
  orders?: Order[];
  tanggal?: string;
  kategori?: string;
  nominal?: string;
  keterangan?: string;
}