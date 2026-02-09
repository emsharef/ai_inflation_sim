import { CpiComponent, HierarchyLevel } from '@/lib/types';

// ---------------------------------------------------------------------------
// CPI-U Component Hierarchy
// Weights reflect Dec 2024 relative importance (% of total CPI-U). CPI rates as of Dec 2025.
// Series IDs follow BLS CUUR0000SAx convention.
// ---------------------------------------------------------------------------

export const cpiComponents: Record<string, CpiComponent> = {
  // =======================================================================
  // FOOD & BEVERAGES  (14.3%)
  // =======================================================================
  food_bev: {
    id: 'food_bev',
    name: 'Food & Beverages',
    seriesId: 'CUUR0000SA0',
    weight: 14.3,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: ['food_home', 'food_away', 'alcoholic_bev'],
  },

  // --- Food at home (8.7%) ---
  food_home: {
    id: 'food_home',
    name: 'Food at home',
    seriesId: 'CUUR0000SAF11',
    weight: 8.7,
    parentId: 'food_bev',
    level: 1 as HierarchyLevel,
    children: [
      'cereals',
      'meats_poultry_fish_eggs',
      'dairy',
      'fruits_vegetables',
      'nonalcoholic_bev',
      'other_food_home',
    ],
  },
  cereals: {
    id: 'cereals',
    name: 'Cereals & bakery products',
    seriesId: 'CUUR0000SAF111',
    weight: 1.0,
    parentId: 'food_home',
    level: 2 as HierarchyLevel,
    children: [],
  },
  meats_poultry_fish_eggs: {
    id: 'meats_poultry_fish_eggs',
    name: 'Meats, poultry, fish & eggs',
    seriesId: 'CUUR0000SAF112',
    weight: 1.9,
    parentId: 'food_home',
    level: 2 as HierarchyLevel,
    children: [],
  },
  dairy: {
    id: 'dairy',
    name: 'Dairy & related products',
    seriesId: 'CUUR0000SAF113',
    weight: 0.75,
    parentId: 'food_home',
    level: 2 as HierarchyLevel,
    children: [],
  },
  fruits_vegetables: {
    id: 'fruits_vegetables',
    name: 'Fruits & vegetables',
    seriesId: 'CUUR0000SAF114',
    weight: 1.2,
    parentId: 'food_home',
    level: 2 as HierarchyLevel,
    children: [],
  },
  nonalcoholic_bev: {
    id: 'nonalcoholic_bev',
    name: 'Nonalcoholic beverages & beverage materials',
    seriesId: 'CUUR0000SAF115',
    weight: 1.0,
    parentId: 'food_home',
    level: 2 as HierarchyLevel,
    children: [],
  },
  other_food_home: {
    id: 'other_food_home',
    name: 'Other food at home',
    seriesId: 'CUUR0000SAF116',
    weight: 2.85,
    parentId: 'food_home',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Food away from home (4.8%) ---
  food_away: {
    id: 'food_away',
    name: 'Food away from home',
    seriesId: 'CUUR0000SEFV',
    weight: 4.8,
    parentId: 'food_bev',
    level: 1 as HierarchyLevel,
    children: [],
  },

  // --- Alcoholic beverages (0.8%) ---
  alcoholic_bev: {
    id: 'alcoholic_bev',
    name: 'Alcoholic beverages',
    seriesId: 'CUUR0000SAF2',
    weight: 0.8,
    parentId: 'food_bev',
    level: 1 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // HOUSING  (44.6%)
  // =======================================================================
  housing: {
    id: 'housing',
    name: 'Housing',
    seriesId: 'CUUR0000SAH',
    weight: 44.6,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: ['shelter', 'fuels_utilities', 'household_furnishings'],
  },

  // --- Shelter (35.7%) ---
  shelter: {
    id: 'shelter',
    name: 'Shelter',
    seriesId: 'CUUR0000SAH1',
    weight: 35.7,
    parentId: 'housing',
    level: 1 as HierarchyLevel,
    children: ['rent_primary', 'owners_equiv_rent', 'lodging_away'],
  },
  rent_primary: {
    id: 'rent_primary',
    name: 'Rent of primary residence',
    seriesId: 'CUUR0000SEHA',
    weight: 7.6,
    parentId: 'shelter',
    level: 2 as HierarchyLevel,
    children: [],
  },
  owners_equiv_rent: {
    id: 'owners_equiv_rent',
    name: "Owners' equivalent rent of residences",
    seriesId: 'CUUR0000SEHC',
    weight: 26.8,
    parentId: 'shelter',
    level: 2 as HierarchyLevel,
    children: [],
  },
  lodging_away: {
    id: 'lodging_away',
    name: 'Lodging away from home',
    seriesId: 'CUUR0000SEHB',
    weight: 1.3,
    parentId: 'shelter',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Fuels & utilities (4.65%) ---
  fuels_utilities: {
    id: 'fuels_utilities',
    name: 'Fuels & utilities',
    seriesId: 'CUUR0000SAH2',
    weight: 4.65,
    parentId: 'housing',
    level: 1 as HierarchyLevel,
    children: ['fuel_oil', 'energy_services', 'water_sewer_trash'],
  },
  fuel_oil: {
    id: 'fuel_oil',
    name: 'Fuel oil & other fuels',
    seriesId: 'CUUR0000SEHE',
    weight: 0.25,
    parentId: 'fuels_utilities',
    level: 2 as HierarchyLevel,
    children: [],
  },
  energy_services: {
    id: 'energy_services',
    name: 'Energy services (electricity & piped gas)',
    seriesId: 'CUUR0000SEHF',
    weight: 3.3,
    parentId: 'fuels_utilities',
    level: 2 as HierarchyLevel,
    children: [],
  },
  water_sewer_trash: {
    id: 'water_sewer_trash',
    name: 'Water, sewer & trash collection',
    seriesId: 'CUUR0000SEHG',
    weight: 1.1,
    parentId: 'fuels_utilities',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Household furnishings & operations (3.7%) ---
  household_furnishings: {
    id: 'household_furnishings',
    name: 'Household furnishings & operations',
    seriesId: 'CUUR0000SAH3',
    weight: 4.25,
    parentId: 'housing',
    level: 1 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // APPAREL  (2.5%)
  // =======================================================================
  apparel: {
    id: 'apparel',
    name: 'Apparel',
    seriesId: 'CUUR0000SAA',
    weight: 2.5,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: [
      'mens_boys_apparel',
      'womens_girls_apparel',
      'footwear',
      'infants_toddlers_apparel',
      'jewelry_watches',
    ],
  },
  mens_boys_apparel: {
    id: 'mens_boys_apparel',
    name: "Men's & boys' apparel",
    seriesId: 'CUUR0000SAA1',
    weight: 0.6,
    parentId: 'apparel',
    level: 1 as HierarchyLevel,
    children: [],
  },
  womens_girls_apparel: {
    id: 'womens_girls_apparel',
    name: "Women's & girls' apparel",
    seriesId: 'CUUR0000SAA2',
    weight: 0.6,
    parentId: 'apparel',
    level: 1 as HierarchyLevel,
    children: [],
  },
  footwear: {
    id: 'footwear',
    name: 'Footwear',
    seriesId: 'CUUR0000SEAE',
    weight: 0.6,
    parentId: 'apparel',
    level: 1 as HierarchyLevel,
    children: [],
  },
  infants_toddlers_apparel: {
    id: 'infants_toddlers_apparel',
    name: "Infants' & toddlers' apparel",
    seriesId: 'CUUR0000SEAF',
    weight: 0.1,
    parentId: 'apparel',
    level: 1 as HierarchyLevel,
    children: [],
  },
  jewelry_watches: {
    id: 'jewelry_watches',
    name: 'Jewelry & watches',
    seriesId: 'CUUR0000SEAG',
    weight: 0.3,
    parentId: 'apparel',
    level: 1 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // TRANSPORTATION  (16.6%)
  // =======================================================================
  transportation: {
    id: 'transportation',
    name: 'Transportation',
    seriesId: 'CUUR0000SAT',
    weight: 16.6,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: ['private_transport', 'public_transport'],
  },

  // --- Private transportation (15.6%) ---
  private_transport: {
    id: 'private_transport',
    name: 'Private transportation',
    seriesId: 'CUUR0000SAT1',
    weight: 15.6,
    parentId: 'transportation',
    level: 1 as HierarchyLevel,
    children: [
      'new_vehicles',
      'used_vehicles',
      'motor_fuel',
      'motor_vehicle_insurance',
      'motor_vehicle_maintenance',
      'motor_vehicle_parts',
      'motor_vehicle_fees',
    ],
  },
  new_vehicles: {
    id: 'new_vehicles',
    name: 'New vehicles',
    seriesId: 'CUUR0000SETA',
    weight: 3.8,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },
  used_vehicles: {
    id: 'used_vehicles',
    name: 'Used cars & trucks',
    seriesId: 'CUUR0000SETB',
    weight: 2.0,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },
  motor_fuel: {
    id: 'motor_fuel',
    name: 'Motor fuel',
    seriesId: 'CUUR0000SETB01',
    weight: 3.2,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },
  motor_vehicle_insurance: {
    id: 'motor_vehicle_insurance',
    name: 'Motor vehicle insurance',
    seriesId: 'CUUR0000SETD',
    weight: 3.1,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },
  motor_vehicle_maintenance: {
    id: 'motor_vehicle_maintenance',
    name: 'Motor vehicle maintenance & repair',
    seriesId: 'CUUR0000SETC',
    weight: 1.1,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },
  motor_vehicle_parts: {
    id: 'motor_vehicle_parts',
    name: 'Motor vehicle parts & equipment',
    seriesId: 'CUUR0000SETC01',
    weight: 0.4,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },
  motor_vehicle_fees: {
    id: 'motor_vehicle_fees',
    name: 'Motor vehicle fees',
    seriesId: 'CUUR0000SETE',
    weight: 0.5,
    parentId: 'private_transport',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Public transportation (1.0%) ---
  public_transport: {
    id: 'public_transport',
    name: 'Public transportation',
    seriesId: 'CUUR0000SAT2',
    weight: 1.0,
    parentId: 'transportation',
    level: 1 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // MEDICAL CARE  (8.1%)
  // =======================================================================
  medical_care: {
    id: 'medical_care',
    name: 'Medical care',
    seriesId: 'CUUR0000SAM',
    weight: 8.1,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: ['medical_commodities', 'medical_services'],
  },

  // --- Medical care commodities (1.6%) ---
  medical_commodities: {
    id: 'medical_commodities',
    name: 'Medical care commodities',
    seriesId: 'CUUR0000SAM1',
    weight: 1.6,
    parentId: 'medical_care',
    level: 1 as HierarchyLevel,
    children: ['prescription_drugs', 'nonprescription_drugs'],
  },
  prescription_drugs: {
    id: 'prescription_drugs',
    name: 'Prescription drugs',
    seriesId: 'CUUR0000SEMF01',
    weight: 1.0,
    parentId: 'medical_commodities',
    level: 2 as HierarchyLevel,
    children: [],
  },
  nonprescription_drugs: {
    id: 'nonprescription_drugs',
    name: 'Nonprescription drugs & medical supplies',
    seriesId: 'CUUR0000SEMF02',
    weight: 0.6,
    parentId: 'medical_commodities',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Medical care services (6.5%) ---
  medical_services: {
    id: 'medical_services',
    name: 'Medical care services',
    seriesId: 'CUUR0000SAM2',
    weight: 6.5,
    parentId: 'medical_care',
    level: 1 as HierarchyLevel,
    children: [
      'physicians_services',
      'dental_services',
      'eyeglasses_eye_care',
      'hospital_services',
      'health_insurance',
      'nursing_homes',
    ],
  },
  physicians_services: {
    id: 'physicians_services',
    name: "Physicians' services",
    seriesId: 'CUUR0000SEMC01',
    weight: 1.5,
    parentId: 'medical_services',
    level: 2 as HierarchyLevel,
    children: [],
  },
  dental_services: {
    id: 'dental_services',
    name: 'Dental services',
    seriesId: 'CUUR0000SEMC02',
    weight: 0.8,
    parentId: 'medical_services',
    level: 2 as HierarchyLevel,
    children: [],
  },
  eyeglasses_eye_care: {
    id: 'eyeglasses_eye_care',
    name: 'Eyeglasses & eye care',
    seriesId: 'CUUR0000SEMC03',
    weight: 0.2,
    parentId: 'medical_services',
    level: 2 as HierarchyLevel,
    children: [],
  },
  hospital_services: {
    id: 'hospital_services',
    name: 'Hospital & related services',
    seriesId: 'CUUR0000SEMD',
    weight: 2.3,
    parentId: 'medical_services',
    level: 2 as HierarchyLevel,
    children: [],
  },
  health_insurance: {
    id: 'health_insurance',
    name: 'Health insurance',
    seriesId: 'CUUR0000SEME',
    weight: 0.9,
    parentId: 'medical_services',
    level: 2 as HierarchyLevel,
    children: [],
  },
  nursing_homes: {
    id: 'nursing_homes',
    name: 'Nursing homes & adult day services',
    seriesId: 'CUUR0000SEMD03',
    weight: 0.15,
    parentId: 'medical_services',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // RECREATION  (5.4%)
  // =======================================================================
  recreation: {
    id: 'recreation',
    name: 'Recreation',
    seriesId: 'CUUR0000SAR',
    weight: 5.4,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: [
      'cable_satellite_streaming',
      'tv_equipment',
      'sporting_goods',
      'toys',
      'pets_vet',
      'admissions',
      'other_recreation',
    ],
  },
  cable_satellite_streaming: {
    id: 'cable_satellite_streaming',
    name: 'Cable, satellite TV & streaming services',
    seriesId: 'CUUR0000SERA',
    weight: 1.0,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },
  tv_equipment: {
    id: 'tv_equipment',
    name: 'Televisions & related equipment',
    seriesId: 'CUUR0000SERA01',
    weight: 0.3,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },
  sporting_goods: {
    id: 'sporting_goods',
    name: 'Sporting goods',
    seriesId: 'CUUR0000SERC',
    weight: 0.6,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },
  toys: {
    id: 'toys',
    name: 'Toys',
    seriesId: 'CUUR0000SERC01',
    weight: 0.2,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },
  pets_vet: {
    id: 'pets_vet',
    name: 'Pets, pet products & veterinary services',
    seriesId: 'CUUR0000SERD',
    weight: 0.9,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },
  admissions: {
    id: 'admissions',
    name: 'Admission to movies, theaters, concerts',
    seriesId: 'CUUR0000SERF',
    weight: 0.4,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },
  other_recreation: {
    id: 'other_recreation',
    name: 'Other recreation services',
    seriesId: 'CUUR0000SERG',
    weight: 1.0,
    parentId: 'recreation',
    level: 1 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // EDUCATION & COMMUNICATION  (5.6%)
  // =======================================================================
  education_communication: {
    id: 'education_communication',
    name: 'Education & communication',
    seriesId: 'CUUR0000SAE',
    weight: 5.6,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: ['education', 'communication'],
  },

  // --- Education (2.6%) ---
  education: {
    id: 'education',
    name: 'Education',
    seriesId: 'CUUR0000SAE1',
    weight: 2.6,
    parentId: 'education_communication',
    level: 1 as HierarchyLevel,
    children: ['tuition_childcare', 'educational_books_supplies'],
  },
  tuition_childcare: {
    id: 'tuition_childcare',
    name: 'Tuition, other school fees & childcare',
    seriesId: 'CUUR0000SEEB',
    weight: 2.4,
    parentId: 'education',
    level: 2 as HierarchyLevel,
    children: [],
  },
  educational_books_supplies: {
    id: 'educational_books_supplies',
    name: 'Educational books & supplies',
    seriesId: 'CUUR0000SEEA',
    weight: 0.2,
    parentId: 'education',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Communication (3.0%) ---
  communication: {
    id: 'communication',
    name: 'Communication',
    seriesId: 'CUUR0000SAE2',
    weight: 3.0,
    parentId: 'education_communication',
    level: 1 as HierarchyLevel,
    children: [
      'telephone_services',
      'it_hardware_software',
      'internet_services',
      'postage_delivery',
    ],
  },
  telephone_services: {
    id: 'telephone_services',
    name: 'Telephone services',
    seriesId: 'CUUR0000SEED',
    weight: 1.5,
    parentId: 'communication',
    level: 2 as HierarchyLevel,
    children: [],
  },
  it_hardware_software: {
    id: 'it_hardware_software',
    name: 'Information technology, hardware & services',
    seriesId: 'CUUR0000SEEE',
    weight: 1.0,
    parentId: 'communication',
    level: 2 as HierarchyLevel,
    children: [],
  },
  internet_services: {
    id: 'internet_services',
    name: 'Internet services & electronic information providers',
    seriesId: 'CUUR0000SEEE03',
    weight: 0.35,
    parentId: 'communication',
    level: 2 as HierarchyLevel,
    children: [],
  },
  postage_delivery: {
    id: 'postage_delivery',
    name: 'Postage & delivery services',
    seriesId: 'CUUR0000SEEC',
    weight: 0.15,
    parentId: 'communication',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // =======================================================================
  // OTHER GOODS & SERVICES  (3.4%)
  // =======================================================================
  other_goods_services: {
    id: 'other_goods_services',
    name: 'Other goods & services',
    seriesId: 'CUUR0000SAG',
    weight: 3.4,
    parentId: null,
    level: 0 as HierarchyLevel,
    children: ['personal_care', 'miscellaneous'],
  },

  // --- Personal care (1.4%) ---
  personal_care: {
    id: 'personal_care',
    name: 'Personal care',
    seriesId: 'CUUR0000SAG1',
    weight: 1.4,
    parentId: 'other_goods_services',
    level: 1 as HierarchyLevel,
    children: ['haircuts_services', 'cosmetics_perfume', 'other_personal_care'],
  },
  haircuts_services: {
    id: 'haircuts_services',
    name: 'Haircuts & other personal care services',
    seriesId: 'CUUR0000SEGB',
    weight: 0.7,
    parentId: 'personal_care',
    level: 2 as HierarchyLevel,
    children: [],
  },
  cosmetics_perfume: {
    id: 'cosmetics_perfume',
    name: 'Cosmetics, perfume, bath & nail preparations',
    seriesId: 'CUUR0000SEGC',
    weight: 0.4,
    parentId: 'personal_care',
    level: 2 as HierarchyLevel,
    children: [],
  },
  other_personal_care: {
    id: 'other_personal_care',
    name: 'Other personal care products',
    seriesId: 'CUUR0000SEGD',
    weight: 0.3,
    parentId: 'personal_care',
    level: 2 as HierarchyLevel,
    children: [],
  },

  // --- Miscellaneous (2.0%) ---
  miscellaneous: {
    id: 'miscellaneous',
    name: 'Miscellaneous personal services',
    seriesId: 'CUUR0000SAG2',
    weight: 2.0,
    parentId: 'other_goods_services',
    level: 1 as HierarchyLevel,
    children: [
      'legal_services',
      'financial_services',
      'tax_preparation',
      'funeral_expenses',
      'laundry_dry_cleaning',
    ],
  },
  legal_services: {
    id: 'legal_services',
    name: 'Legal services',
    seriesId: 'CUUR0000SEGE01',
    weight: 0.5,
    parentId: 'miscellaneous',
    level: 2 as HierarchyLevel,
    children: [],
  },
  financial_services: {
    id: 'financial_services',
    name: 'Financial services',
    seriesId: 'CUUR0000SEGE02',
    weight: 0.3,
    parentId: 'miscellaneous',
    level: 2 as HierarchyLevel,
    children: [],
  },
  tax_preparation: {
    id: 'tax_preparation',
    name: 'Tax return preparation & other accounting fees',
    seriesId: 'CUUR0000SEGE03',
    weight: 0.1,
    parentId: 'miscellaneous',
    level: 2 as HierarchyLevel,
    children: [],
  },
  funeral_expenses: {
    id: 'funeral_expenses',
    name: 'Funeral expenses',
    seriesId: 'CUUR0000SEGF',
    weight: 0.15,
    parentId: 'miscellaneous',
    level: 2 as HierarchyLevel,
    children: [],
  },
  laundry_dry_cleaning: {
    id: 'laundry_dry_cleaning',
    name: 'Laundry & dry cleaning services',
    seriesId: 'CUUR0000SEGG',
    weight: 0.1,
    parentId: 'miscellaneous',
    level: 2 as HierarchyLevel,
    children: [],
  },
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Return every component at the given hierarchy level.
 */
export function getComponentsByLevel(level: HierarchyLevel): CpiComponent[] {
  return Object.values(cpiComponents).filter((c) => c.level === level);
}

/**
 * Return the direct children of the component with the given id.
 * Returns an empty array if the id is unknown or the component is a leaf.
 */
export function getChildren(id: string): CpiComponent[] {
  const parent = cpiComponents[id];
  if (!parent) return [];
  return parent.children
    .map((childId) => cpiComponents[childId])
    .filter(Boolean);
}

/**
 * Return all level-0 (major group) components.
 */
export function getMajorGroups(): CpiComponent[] {
  return getComponentsByLevel(0 as HierarchyLevel);
}

/**
 * Return the path from the root major group down to the given component,
 * inclusive of both endpoints. The first element is always a level-0 group
 * and the last element is the component itself.
 *
 * Returns an empty array if the id is not found.
 */
export function getComponentPath(id: string): CpiComponent[] {
  const path: CpiComponent[] = [];
  let current = cpiComponents[id];
  while (current) {
    path.unshift(current);
    if (current.parentId === null) break;
    current = cpiComponents[current.parentId];
  }
  // If we never reached a root, the chain is broken -- return empty.
  if (path.length > 0 && path[0].parentId !== null) return [];
  return path;
}
