export interface Pesticide {
  navn: string;
  reg_nr: string;
  status: string;
  preparatgruppe: string;
  formulering: string;
  avgiftsklasse: string | null;
  merknad_til_status: string | null;
  utgatt_dato: string | null;
  innhold_av_virkestoff: {
    virkestoff: string;
    mengde: number;
    enhet: string;
  }[];
}

export interface Crop {
  id: string;
  name: string;
  area: number;
}

export interface Application {
  id: string; // Unique ID for this specific application instance
  cropId: string;
  pesticide: Pesticide;
  dose: number;
  doseUnit: 'ml' | 'g';
}

export interface CalculationResult {
  totalQuantity: number; // Total in ml or g
  totalInLitersOrKg: number;
  unitLabel: 'Liter' | 'kg';
  packagesNeeded: { size: number; count: number }[];
}

// Represents one aggregated item in the final shopping list
export interface ShoppingListItem {
    pesticide: Pesticide;
    results: CalculationResult;
    breakdown: {
        cropName: string;
        area: number;
        dose: number;
        doseUnit: 'ml' | 'g';
    }[];
}
