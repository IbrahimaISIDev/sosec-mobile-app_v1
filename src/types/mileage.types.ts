// src/types/mileage.types.ts
export interface Mileage { // Rename MileageRecord to Mileage
  id: string;
  truckId: string;
  driverId: string;
  kilometer: number;
  date: Date;
  imageUrl: string;
  licensePlate: string;
  isVerified: boolean;
  syncStatus: "local" | "synced";
}

export type MileageData = Mileage & { localImageUri?: string };
