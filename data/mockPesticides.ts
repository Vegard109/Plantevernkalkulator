// This file is used as a fallback when the live API from Mattilsynet is not available (e.g., in local development).
import type { Pesticide } from '../types';

export const MOCK_PESTICIDES: Pesticide[] = [
  // Ugrasmidler
  {
    navn: "Ariane S",
    reg_nr: "2017.3",
    status: "Godkjent",
    preparatgruppe: "Ugrasmidler",
    formulering: "Suspoemulsjon",
    avgiftsklasse: "3",
    merknad_til_status: null,
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Fluroksipyr", mengde: 100, enhet: "g/l" },
      { virkestoff: "Klorpyralid", mengde: 80, enhet: "g/l" },
      { virkestoff: "Florasulam", mengde: 2.5, enhet: "g/l" }
    ]
  },
  {
    navn: "Roundup Max",
    reg_nr: "2010.5",
    status: "Godkjent, fare for utfasing",
    preparatgruppe: "Ugrasmidler",
    formulering: "Vannløselig konsentrat",
    avgiftsklasse: "4",
    merknad_til_status: "Totalugrasmiddel",
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Glyfosat", mengde: 360, enhet: "g/l" }
    ]
  },
  {
    navn: "Betanal Tandem",
    reg_nr: "2012.33",
    status: "Godkjent",
    preparatgruppe: "Ugrasmidler",
    formulering: "Emulsjonskonsentrat",
    avgiftsklasse: "3",
    merknad_til_status: null,
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Fenmedifam", mengde: 91, enhet: "g/l" },
      { virkestoff: "Desmedifam", mengde: 71, enhet: "g/l" },
      { virkestoff: "Etofumesat", mengde: 112, enhet: "g/l" }
    ]
  },
  // Soppmidler
  {
    navn: "Delan Pro",
    reg_nr: "2019.21",
    status: "Godkjent",
    preparatgruppe: "Soppmidler",
    formulering: "Suspensjonskonsentrat",
    avgiftsklasse: "2",
    merknad_til_status: null,
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Ditianon", mengde: 125, enhet: "g/l" },
      { virkestoff: "Kaliumfosfonat", mengde: 561, enhet: "g/l" }
    ]
  },
  {
    navn: "Propulse",
    reg_nr: "2013.14",
    status: "Godkjent",
    preparatgruppe: "Soppmidler",
    formulering: "Suspoemulsjon",
    avgiftsklasse: "2",
    merknad_til_status: "Systemisk soppmiddel",
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: " protiokonazol", mengde: 125, enhet: "g/l" },
      { virkestoff: "Fluopyram", mengde: 125, enhet: "g/l" }
    ]
  },
  // Insektmidler
  {
    navn: "Karate 5 CS",
    reg_nr: "2007.4",
    status: "Godkjent",
    preparatgruppe: "Insektmidler",
    formulering: "Kapselsuspensjon",
    avgiftsklasse: "3",
    merknad_til_status: "Fare for bier",
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Lambda-cyhalotrin", mengde: 50, enhet: "g/l" }
    ]
  },
  {
    navn: "Decis Mega",
    reg_nr: "2009.6",
    status: "Godkjent",
    preparatgruppe: "Insektmidler",
    formulering: "Emulsjonskonsentrat",
    avgiftsklasse: "3",
    merknad_til_status: null,
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Deltametrin", mengde: 50, enhet: "g/l" }
    ]
  },
  // Vekstregulerende midler
  {
    navn: "Moddus Start",
    reg_nr: "2015.7",
    status: "Godkjent",
    preparatgruppe: "Vekstregulerende midler",
    formulering: "Emulsjonskonsentrat",
    avgiftsklasse: "2",
    merknad_til_status: null,
    utgatt_dato: null,
    innhold_av_virkestoff: [
      { virkestoff: "Trineksapak-etyl", mengde: 250, enhet: "g/l" }
    ]
  }
];
