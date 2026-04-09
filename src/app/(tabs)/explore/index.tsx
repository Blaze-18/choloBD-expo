import React from 'react';
import { useAuthWithAdminCheck } from '../../../hooks/useAuthWithAdminCheck';
import { UserExploreInterface } from '../../../components/explore/UserExploreInterface';
import { AdminExploreInterface } from '../../../components/explore/AdminExploreInterface';

console.log('[ExploreIndex] Rendering explore page');

export default function ExploreIndex() {
  const { isAdmin } = useAuthWithAdminCheck();

  console.log('[ExploreIndex] User is admin:', isAdmin);

  if (isAdmin) {
    return <AdminExploreInterface />;
  }

  return <UserExploreInterface />;
}
