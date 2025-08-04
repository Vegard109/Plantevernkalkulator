
export const DOSE_SUGGESTIONS: { [key: string]: { min: number; max: number; unit: 'ml' | 'g' } } = {
  'Ugrasmidler': { min: 100, max: 300, unit: 'ml' },
  'Soppmidler': { min: 50, max: 150, unit: 'ml' },
  'Insektmidler': { min: 20, max: 80, unit: 'ml' },
  'Vekstregulerende midler': { min: 50, max: 200, unit: 'ml' },
  'Beisemidler': { min: 100, max: 400, unit: 'ml' },
  'Annet': { min: 50, max: 200, unit: 'ml' }
};

export const LIQUID_CONTAINER_SIZES = [1, 5, 10, 20]; // in Liters
export const SOLID_CONTAINER_SIZES = [1, 5, 10, 25]; // in Kilograms
