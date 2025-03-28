// src/types/expense.types.ts
export enum ExpenseType {
  FUEL = 'FUEL',
  OIL = 'OIL',
  REPAIRS = 'REPAIRS',
  OTHER = 'OTHER',
}

export enum InputType {
  MANUAL = 'MANUAL',
  SCAN = 'SCAN',
}

export interface ExpenseData {
  id: string;
  type: ExpenseType;
  date: Date;
  amount: number;
  quantity?: number;
  truck_id: string;
  user_id: string;
  liters?: number;
  created_at: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  receiptImageUrl?: string;
  syncStatus: 'local' | 'synced';
}

export interface ExpenseFormData {
  type: ExpenseType;
  date: Date;
  amount: number;
  quantity?: number;
  notes?: string;
}

export interface Expense {
  id: string;
  truckId: string;
  userId: string;
  type: 'fuel' | 'oil' | 'repair';
  amount: number;
  liters?: number;
  date: string;
  imageUrl?: string;
  created_at: string;
}