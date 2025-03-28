// src/types/history.types.ts
export type HistoryCategory = 'ticket' | 'expense' | 'mileage';

export type HistoryItemType =
  | 'prelevement'
  | 'decharge'
  | 'tableau_bord'
  | 'maintenance'
  | 'carburant'
  | 'peage'
  | 'oil' 
  | 'repair' 
  | 'others'; 

export interface HistoryItem {
  id: string;
  category: HistoryCategory;
  type: HistoryItemType;
  date: Date;
  amount?: number;
  mileage?: number;
  truck_id: string;
  user_id: string;
  label?: string;
  imageUrl?: string;
  syncStatus: 'local' | 'synced';
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface HistoryFilter {
  startDate: Date | null;
  endDate: Date | null;
  types: HistoryItemType[];
  minAmount: number | null;
  maxAmount: number | null;
}
