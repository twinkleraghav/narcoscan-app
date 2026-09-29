/* ============================================================
   NarcoScan — Reagent Catalog & Guided SOP Matrix
   Includes PPE Safety Alerts, Reaction Kinetics, and Secondary Tests
   ============================================================ */

import { Reagent } from '../types';

export const REAGENTS: Reagent[] = [
  {
    id: 'marquis',
    name: 'Marquis Reagent',
    description: 'Purple/black reaction for opiates, orange-brown for amphetamines',
    targetSubstance: 'Opiates (Heroin/Morphine) / MDMA / Amphetamines',
    positiveColour: 'Purple/Black or Orange-Brown',
    hazardAlert: 'PPE HAZARD ALERT (NCB SOP-04): Concentrated H₂SO₄ acid base. Potential synthetic opioid / fentanyl exposure risk. Nitrile gloves and eye protection mandatory. Have Naloxone on standby.',
    kineticPeakSeconds: 30,
    secondaryRecommendation: "Simon's Reagent or Mandelin Reagent to differentiate amphetamines from cutting agents (paracetamol/caffeine).",
  },
  {
    id: 'mecke',
    name: 'Mecke Reagent',
    description: 'Blue-green for opiates, olive/brown for MDMA',
    targetSubstance: 'Opiates / MDMA',
    positiveColour: 'Blue-Green or Olive',
    hazardAlert: 'PPE HAZARD ALERT: Contains selenious acid in sulfuric acid. Toxic skin absorption hazard. Work under ventilated conditions.',
    kineticPeakSeconds: 25,
    secondaryRecommendation: 'Marquis Reagent for cross-validation of opiate subclass.',
  },
  {
    id: 'mandelin',
    name: 'Mandelin Reagent',
    description: 'Dark brown for opiates, black/blue for amphetamines',
    targetSubstance: 'Opiates / Amphetamines / Ketamine',
    positiveColour: 'Dark Brown or Deep Blue-Green',
    hazardAlert: 'PPE HAZARD ALERT: Ammonium vanadate base. Strong oxidizer. Wear chemical-resistant gloves.',
    kineticPeakSeconds: 30,
    secondaryRecommendation: "Scott Reagent if cocaine adulterant suspected; Simon's Reagent for secondary amines.",
  },
  {
    id: 'scott',
    name: 'Scott Reagent (Modified)',
    description: 'Blue precipitate / blue organic layer indicates cocaine HCl or base',
    targetSubstance: 'Cocaine (HCl & Freebase)',
    positiveColour: 'Cobalt Blue Precipitate',
    hazardAlert: 'PPE HAZARD ALERT: Contains cobalt thiocyanate and hydrochloric acid. Avoid skin contact.',
    kineticPeakSeconds: 20,
    secondaryRecommendation: "Odor / sodium bicarbonate effervescence test; Simon's test if cutting with levamisole suspected.",
  },
  {
    id: 'duquenois',
    name: 'Duquenois-Levine Reagent',
    description: 'Purple colour transferred to chloroform layer indicates cannabinoids',
    targetSubstance: 'Cannabinoids (THC / Charas / Ganja)',
    positiveColour: 'Purple (Lower Organic Layer)',
    hazardAlert: 'PPE HAZARD ALERT: Chloroform extraction phase. Toxic vapor inhalation risk. Do not inhale organic vapors.',
    kineticPeakSeconds: 45,
    secondaryRecommendation: 'Microscopic cystolithic hair examination under standard NCB field guidelines.',
  },
  {
    id: 'simon',
    name: "Simon's Reagent",
    description: 'Cobalt blue indicates secondary amines (methamphetamine, MDMA)',
    targetSubstance: 'Methamphetamine / MDMA',
    positiveColour: 'Intense Blue',
    hazardAlert: 'PPE HAZARD ALERT: Binary aqueous reagent. Sodium nitroprusside component. Wear standard nitrile gloves.',
    kineticPeakSeconds: 15,
    secondaryRecommendation: 'Marquis Reagent to differentiate methamphetamine (orange) from MDMA (purple/black).',
  },
  {
    id: 'ehrlich',
    name: 'Ehrlich Reagent',
    description: 'Purple/violet indicates indole alkaloids (LSD, DMT, psilocybin)',
    targetSubstance: 'Indoles (LSD / Psilocybin / DMT)',
    positiveColour: 'Purple / Violet',
    hazardAlert: 'PPE HAZARD ALERT: p-DMAB in concentrated hydrochloric acid. Acid burn risk.',
    kineticPeakSeconds: 60,
    secondaryRecommendation: 'UV fluorescence test (365nm) under dark observation box.',
  },
  {
    id: 'froehde',
    name: 'Froehde Reagent',
    description: 'Colour progression for various alkaloids and synthetic analgesics',
    targetSubstance: 'Opiates / Morphine / Codeine',
    positiveColour: 'Purple to Slate Blue',
    hazardAlert: 'PPE HAZARD ALERT: Molybdic acid in concentrated sulfuric acid. Avoid heat generation upon dilution.',
    kineticPeakSeconds: 30,
    secondaryRecommendation: 'Marquis Reagent for confirmatory colour match.',
  },
];
