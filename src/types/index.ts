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
  keteranganTambahan: string;
}

export interface KategoriData {
  [subCategory: string]: string; // Maps subCategory to COA ID
}

export interface LogoutResponse {
  message: string;
}

// Type for proxy request body (matches Apps Script doPost input)
export interface ProxyRequestBody {
  action: 'checkLogin' | 'logout' | 'getCustomerList' | 'getItemList' | 'submitOrders' | 'submitFormOperationalAccounting' | 'getKategoriData' | 'generateLedger' | 'printInvoiceToPDF' | 'isAuthenticated';
  username?: string;
  password?: string;
  deliveryDate?: string;
  orders?: Order[];
  entryDate?: string;
  entries?: Omit<OperationalAccountingData, "keteranganTambahan">[]
  sheet?: string;
  tanggal?: string;
  kategori?: string;
  nominal?: string;
  keterangan?: string;
}