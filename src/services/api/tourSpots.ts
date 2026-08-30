/**
 * Tour Spots API Service
 * Handles fetching tour spots from the backend
 */

import { getApiInstance } from './axiosClient';
import { unwrapListData } from '../../utils/paginatedList';

export interface TourSpot {
  id: string;
  name: string;
  description?: string;
  locationName: string;
  tourType: string;
  rating?: number;
  imageUrl?: string;
  isPopular: boolean;
}

export interface TourSpotFilters {
  isPopular?: boolean;
  locationId?: string;
  divisionId?: string;
  name?: string;
  tourType?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface TourSpotImage {
  id: string;
  url: string;
  altText?: string;
  order: number;
}

export interface TourSpotReview {
  id: string;
  title?: string;
  description?: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    userName: string;
    imageUrl?: string;
  };
}

export interface TourSpotLocation {
  id: string;
  name: string;
  locationType?: string;
  country?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface TourSpotDetail {
  id: string;
  name: string;
  description?: string;
  tourType: string;
  rating?: number;
  isPopular: boolean;
  isActive: boolean;
  bestTimeToVisit?: string;
  seasonalInfo?: any;
  createdAt: string;
  location: TourSpotLocation;
  images: TourSpotImage[];
  reviews: TourSpotReview[];
}

/**
 * Fetch tour spots with optional filters
 * GET /api/tour-spots
 */
export async function getTourSpots(filters?: TourSpotFilters): Promise<TourSpot[]> {
  const api = getApiInstance();
  
  const params: any = {};
  if (filters?.isPopular !== undefined) params.isPopular = filters.isPopular;
  if (filters?.locationId) params.locationId = filters.locationId;
  if (filters?.divisionId) params.divisionId = filters.divisionId;
  if (filters?.name) params.name = filters.name;
  if (filters?.tourType) params.tourType = filters.tourType;
  if (filters?.minRating !== undefined) params.minRating = filters.minRating;
  if (filters?.page !== undefined) params.page = filters.page;
  if (filters?.limit !== undefined) params.limit = filters.limit;

  console.log('[getTourSpots] 🔍 Request details:', {
    endpoint: '/api/tour-spots',
    params,
    baseURL: api.defaults.baseURL
  });

  const response = await api.get('/api/tour-spots', { params });
  const data = unwrapListData<any>(response.data.data, filters?.page, filters?.limit).results;
  
  console.log('[getTourSpots] 📦 Response received:', {
    status: response.status,
    dataCount: data.length,
    firstItem: data[0] ? {
      id: data[0].id,
      name: data[0].name,
      isPopular: data[0].isPopular,
      hasImages: !!data[0].images,
      imageCount: data[0].images?.length
    } : 'NO DATA'
  });
  
  const mapped = data.map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    description: spot.description,
    locationName: spot.location?.name || 'Unknown Location',
    tourType: spot.tourType || 'MIXED',
    rating: spot.rating,
    imageUrl: spot.images?.[0]?.url || undefined,
    isPopular: spot.isPopular || false,
  }));

  console.log('[getTourSpots] ✨ Mapped spots:', {
    count: mapped.length,
    firstSpot: mapped[0] || 'EMPTY'
  });

  return mapped;
}

/**
 * Fetch single tour spot detail by ID
 * GET /api/tour-spots/:id
 */
export async function getTourSpotDetail(id: string): Promise<TourSpotDetail> {
  const api = getApiInstance();
  
  console.log('[getTourSpotDetail] 🔍 Fetching spot:', id);

  const response = await api.get(`/api/tour-spots/${id}`);
  const spot = response.data.data;
  
  console.log('[getTourSpotDetail] 📦 Response received:', {
    id: spot.id,
    name: spot.name,
    imagesCount: spot.images?.length || 0,
    reviewsCount: spot.reviews?.length || 0,
  });

  return {
    id: spot.id,
    name: spot.name,
    description: spot.description,
    tourType: spot.tourType || 'MIXED',
    rating: spot.rating,
    isPopular: spot.isPopular || false,
    isActive: spot.isActive || false,
    bestTimeToVisit: spot.bestTimeToVisit,
    seasonalInfo: spot.seasonalInfo,
    createdAt: spot.createdAt,
    location: {
      id: spot.location.id,
      name: spot.location.name,
      locationType: spot.location.locationType,
      country: spot.location.country,
      state: spot.location.state,
      city: spot.location.city,
      latitude: spot.location.latitude,
      longitude: spot.location.longitude,
    },
    images: spot.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      order: img.order,
    })) || [],
    reviews: spot.reviews?.map((review: any) => ({
      id: review.id,
      title: review.title,
      description: review.description,
      rating: review.rating,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        userName: review.user.userName,
        imageUrl: review.user.imageUrl,
      },
    })) || [],
  };
}
