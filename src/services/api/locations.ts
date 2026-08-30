import { getApiInstance } from './axiosClient';
import { Location } from '../../types/locations';
import { unwrapListData } from '../../utils/paginatedList';

export async function fetchLocations(): Promise<Location[]> {
  const api = getApiInstance();
  const res = await api.get('/api/locations');
  return unwrapListData<Location>(res.data.data).results;
}

export { Location } from '../../types/locations';
