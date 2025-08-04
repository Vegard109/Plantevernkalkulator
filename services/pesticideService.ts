import type { Pesticide } from '../types';
import { MOCK_PESTICIDES } from '../data/mockPesticides';

export const fetchPesticides = async (): Promise<Pesticide[]> => {
  const apiUrl = '/api/godkjente_kjemiske_mikrobiologiske_preparater';

  try {
    // This will only work when deployed to Netlify with the proxy.
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // This error will be caught by the catch block below.
      throw new Error(`Proxy fetch failed with status: ${response.status}`);
    }

    const data: Pesticide[] = await response.json();
    console.log("Suksess! Hentet live data fra Mattilsynet via proxy.");
    
    // Filter for valid and approved pesticides to ensure data quality
    return data.filter(p => 
      p.status && (p.status.toLowerCase() === 'godkjent' || p.status.toLowerCase() === 'godkjent, fare for utfasing')
    );

  } catch (error) {
    console.warn(
      `Kunne ikke hente live data: ${error}. \n` +
      "Dette er forventet under lokal utvikling. Faller tilbake på innebygde testdata. " +
      "Live data vil fungere automatisk når appen er publisert på Netlify."
    );
    // Fallback to mock data
    return MOCK_PESTICIDES.filter(p => 
      p.status && (p.status.toLowerCase() === 'godkjent' || p.status.toLowerCase() === 'godkjent, fare for utfasing')
    );
  }
};
