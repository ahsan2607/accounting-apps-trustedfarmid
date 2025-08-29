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
  keterangan: KategoriData;
  keteranganTambahan: string;
}

export interface KategoriData {
  transactionId: string,
  accountName: string,
  accountType: string,
  statementType: string,
  subCategory: string,
}

export interface LoginData {
  id: string;
  username: string;
  role: string;
  accessibleAccounts: AccessibleAccount[];
}

export interface AccessibleAccount {
  id: string;
  name: string;
}

export interface TransferableAccount {
  id: string;
  name: string;
}

export interface LogoutResponse {
  message: string;
}

// Type for proxy request body (matches Apps Script doPost input)
export interface ProxyRequestBody {
  action: 'checkLogin' | 'logout' | 'getCustomerList' | 'getItemList' | 'submitOrders' | 'submitFormOperationalAccounting' | 'getAccountingCategoryData' | 'getAccountingTransferableAccounts' |'generateLedger' | 'printInvoiceToPDF' | 'isAuthenticated';
  username?: string;
  password?: string;
  deliveryDate?: string;
  orders?: Order[];
  entryDate?: string;
  entries?: Omit<OperationalAccountingData, "keteranganTambahan">[]
  sheet?: string;
  account?: string;
  tanggal?: string;
  kategori?: string;
  nominal?: string;
  keterangan?: string;
}