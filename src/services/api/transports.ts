import { getApiInstance } from './axiosClient';
import {
  Transport,
  TransportFilters,
  TransportSearchParams,
  CreateTransportData,
  UpdateTransportData,
  UpdateTransportAdminData,
} from '@/types/transports';
import { unwrapListData, PaginatedList } from '@/utils/paginatedList';

/**
 * Build query parameters for transport list endpoints
 */
function buildTransportParams(filters?: TransportFilters | TransportSearchParams): Record<string, string> {
  const params: Record<string, string> = {};

  if (!filters) return params;

  if (filters.locationId) params.locationId = filters.locationId;
  if (filters.divisionId) params.divisionId = filters.divisionId;
  if (filters.transportType) params.transportType = filters.transportType;
  if (filters.isActive !== undefined) params.isActive = String(filters.isActive);
  if (filters.isVerified !== undefined) params.isVerified = String(filters.isVerified);
  if (filters.search) params.search = filters.search;
  if (filters.name) params.name = filters.name;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);

  // Add 'q' for search-specific queries
  if ('q' in filters && filters.q) {
    params.q = filters.q;
  }

  return params;
}

/**
 * Get all transports with optional filters
 */
export async function getTransports(filters?: TransportFilters): Promise<PaginatedList<Transport>> {
  const params = buildTransportParams(filters);
  const res = await getApiInstance().get('/api/transports', { params });
  return unwrapListData<Transport>(res.data.data);
}

/**
 * Search transports with a query string
 */
export async function searchTransports(searchParams: TransportSearchParams): Promise<PaginatedList<Transport>> {
  const params = buildTransportParams(searchParams);
  const res = await getApiInstance().get('/api/transports/search', { params });
  return unwrapListData<Transport>(res.data.data);
}

/**
 * Get transports by location ID
 */
export async function getTransportsByLocation(locationId: string): Promise<Transport[]> {
  const res = await getApiInstance().get(`/api/transports/location/${locationId}`);
  return res.data.data;
}

/**
 * Get the transport associated with the current service admin user
 */
export async function getMyTransport(): Promise<Transport> {
  const res = await getApiInstance().get('/api/transports/my');
  return res.data.data;
}

/**
 * Get transport detail by ID
 */
export async function getTransportDetail(transportId: string): Promise<Transport> {
  const res = await getApiInstance().get(`/api/transports/${transportId}`);
  return res.data.data;
}

/**
 * Create a new transport (admin only)
 */
export async function createTransport(data: CreateTransportData): Promise<Transport> {
  const res = await getApiInstance().post('/api/transports/admin', data);
  return res.data.data;
}

/**
 * Update transport (service admin - own transport)
 */
export async function updateTransport(transportId: string, data: UpdateTransportData): Promise<Transport> {
  const res = await getApiInstance().put(`/api/transports/${transportId}`, data);
  return res.data.data;
}

/**
 * Update transport (admin - any transport)
 */
export async function updateTransportAdmin(
  transportId: string,
  data: UpdateTransportAdminData
): Promise<Transport> {
  const res = await getApiInstance().put(`/api/transports/admin/${transportId}`, data);
  return res.data.data;
}

/**
 * Delete a transport
 */
export async function deleteTransport(transportId: string): Promise<{ message: string }> {
  const res = await getApiInstance().delete(`/api/transports/${transportId}`);
  return res.data.data;
}
