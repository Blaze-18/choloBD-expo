export interface Location {
  id: string;
  name: string;
  locationType?: 'DIVISION' | 'DISTRICT' | 'AREA' | 'CITY' | string;
  state?: string; // Parent division
  country?: string;
  parentLocationId?: string;
}
