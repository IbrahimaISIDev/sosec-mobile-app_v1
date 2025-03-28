// src/types/ticket.types.ts
// Type pour les résultats des tickets
export interface TicketData {
  id: string;
  type: "weight";
  ticket_num: string;
  entryDate: Date;
  exitDate: Date;
  truck_id: string;
  product: string;
  netWeight: number;
  carrier: string;
  user_id: string;
  orderId: string;
  supplier: string;
  scanned_date: string;
  imageUrl: string;
  verificationStatus: "pending" | "verified" | "rejected";
  syncStatus: "local" | "synced";
}

// export interface Ticket {
//   id: string;
//   ticket_num: string;
//   date_entree: string;
//   date_sortie: string;
//   camion_id: string;
//   produit: string;
//   poids_net: number;
//   transporteur: string;
//   chauffeur: string;
//   commande_id?: string;
//   fournisseur?: string;
//   image_url?: string;
// }

// Type pour les résultats des bons de carburant
export interface FuelData {
  id: string;
  type: "fuel";
  date: Date;
  driver: string;
  phoneNumber: string;
  truckId: string;
  fuelType: string;
  quantity: number;
  amount: number;
  imageUrl: string;
  verificationStatus: "pending" | "verified" | "rejected";
  syncStatus: "local" | "synced";
}

// Type pour les résultats du kilométrage
export interface MileageData {
  id: string;
  kilometer: number;
  truckId: string;
  driverId: string;
  date: Date;
  imageUrl: string;
  isVerified: boolean;
  syncStatus: "local" | "synced";
  localImageUri?: string;
}

export type Ticket = TicketData | FuelData | MileageData;

export interface ExtractedTicketData {
  ticket_num: string;
  date_entree: string;
  date_sortie: string;
  camion_id: string;
  produit: string;
  poids_net: number;
  chauffeur: string;
}