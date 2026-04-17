import { getApiInstance } from './axiosClient';
import { Location } from '../../types/locations';

export async function fetchLocations(): Promise<Location[]> {
  const api = getApiInstance();
  const res = await api.get('/api/locations');
  return res.data.data || [];
}

export { Location } from '../../types/locations';
