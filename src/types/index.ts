// Firebase types matching RoutaApp models

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageURL: string;
  popularMonths: string[];
  averageTemperature: Temperature;
  currency: string;
  language: string;
  coordinates: Coordinates;
  address: string;
  climate?: string;
  costOfLiving?: CostOfLiving;
  topAttractions?: Attraction[];
  travelStyle?: string[];
  bestFor?: string[];
  popularity?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Temperature {
  summer: number;
  winter: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CostOfLiving {
  level: string;
  symbol: string;
  description: string;
  dailyBudgetMin: number;
  dailyBudgetMax: number;
}

export interface Attraction {
  name: string;
  type?: string;
}

export interface PopularPlace {
  id: string;
  name: string;
  type: string;
  cityId: string;
  coordinates: Coordinates;
  rating: number;
  imageURL: string;
  description: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalDestinations: number;
  totalPlaces: number;
  totalCountries: number;
  recentDestinations: Destination[];
  recentPlaces: PopularPlace[];
}

// User for auth
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
