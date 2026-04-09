import { Location } from './locations';

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: {
    id: string;
    name: string;
  };
  images: Array<{ url: string }>;
  _count?: {
    reviews: number;
  };
  roomTypes?: Array<{
    id: string;
    pricePerNight: number;
  }>;
}

export interface RoomType {
  id: string;
  roomType: string;
  singleBedCount?: number;
  doubleBedCount?: number;
  pricePerNight: number;
  availableCount: number;
  images?: Array<{ url: string }>;
}

export interface HotelDetail {
  id: string;
  name: string;
  description: string;
  rating: number;
  location: Location | {
    id: string;
    name: string;
  };
  images: Array<{ url: string }>;
  roomTypes: RoomType[];
  amenities?: string[];
  policies?: string[];
  phoneNumber?: string;
  email?: string;
  checkInTime?: string;
  checkOutTime?: string;
}
