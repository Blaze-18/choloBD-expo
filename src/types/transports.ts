import { TransportServiceType, BusServiceType, VehicleRentalCategory, HotelRoomStatus } from './enums';

// Base Transport entity
export interface Transport {
  id: string;
  serviceAdminUserId: string;
  name: string;
  description: string;
  transportType: TransportServiceType;
  locationId: string | null;
  contactEmail: string;
  phoneNumber: string;
  extraPhoneNumbers: string[];
  website: string | null;
  vehicleCount: number;
  capacity: number | null;
  licensePlatePrefix: string | null;
  operatingRoutes: string[];
  amenities: string[];
  policies: string[];
  rating: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  location?: {
    id: string;
    name: string;
    division: string;
  };
  images?: Array<{
    id: string;
    url: string;
    altText?: string;
  }>;
  _count?: {
    reviews?: number;
    images?: number;
    classes?: number;
    routes?: number;
    trips?: number;
    vehicles?: number;
  };
}

// Transport Class (for buses and rentals)
export interface TransportClass {
  id: string;
  transportId: string;
  name: string;
  busServiceType: BusServiceType | null;
  vehicleRentalCategory: VehicleRentalCategory | null;
  basePrice: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Transport Route
export interface TransportRoute {
  id: string;
  transportId: string;
  originLocationId: string;
  destinationLocationId: string;
  name: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  originLocation?: {
    id: string;
    name: string;
  };
  destinationLocation?: {
    id: string;
    name: string;
  };
  stops?: TransportRouteStop[];
}

export interface TransportRouteStop {
  id: string;
  transportRouteId: string;
  locationId: string;
  name: string;
  stopOrder: number;
  arrivalOffsetMinutes: number | null;
  createdAt: Date | string;
}

// Transport Layout
export interface TransportLayout {
  id: string;
  transportId: string;
  name: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  compartments?: TransportCompartment[];
}

export interface TransportCompartment {
  id: string;
  layoutId: string;
  name: string;
  sortOrder: number;
  createdAt: Date | string;
  seats?: TransportSeat[];
}

export interface TransportSeat {
  id: string;
  compartmentId: string;
  transportClassId: string;
  seatLabel: string;
  rowLabel: string | null;
  columnLabel: string | null;
  isActive: boolean;
  createdAt: Date | string;
  compartmentName?: string;
  isAvailable?: boolean;
}

// Transport Trip
export interface TransportTrip {
  id: string;
  transportId: string;
  transportRouteId: string;
  layoutId: string;
  departureDateTime: Date | string;
  arrivalDateTime: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  route?: TransportRoute;
  layout?: TransportLayout;
}

export interface TransportTripSeatMap {
  tripId: string;
  layoutId: string;
  seats: TransportSeat[];
}

// Transport Vehicle
export interface TransportVehicle {
  id: string;
  transportId: string;
  transportClassId: string;
  name: string | null;
  licensePlate: string | null;
  vehicleStatus: HotelRoomStatus;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  transportClass?: TransportClass;
}

// Filter types
export interface TransportFilters {
  locationId?: string;
  divisionId?: string;
  transportType?: TransportServiceType;
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  name?: string;
  page?: number;
  limit?: number;
}

export interface TransportSearchParams extends TransportFilters {
  q: string;
}

// Create/Update types
export interface CreateTransportData {
  name: string;
  description: string;
  transportType: TransportServiceType;
  contactEmail: string;
  phoneNumber: string;
  locationId?: string;
  serviceAdminUserId?: string;
  extraPhoneNumbers?: string[];
  website?: string;
  vehicleCount?: number;
  capacity?: number;
  licensePlatePrefix?: string;
  operatingRoutes?: string[];
  amenities?: string[];
  policies?: string[];
  imageURLs?: string[];
}

export interface UpdateTransportData {
  description?: string;
  contactEmail?: string;
  phoneNumber?: string;
  extraPhoneNumbers?: string[];
  website?: string;
  locationId?: string;
  vehicleCount?: number;
  capacity?: number;
  licensePlatePrefix?: string;
  operatingRoutes?: string[];
  amenities?: string[];
  policies?: string[];
  imageURLs?: string[];
  imageIdsToDelete?: string[];
}

export interface UpdateTransportAdminData extends UpdateTransportData {
  name?: string;
  transportType?: TransportServiceType;
  serviceAdminUserId?: string;
  isActive?: boolean;
  isVerified?: boolean;
}
