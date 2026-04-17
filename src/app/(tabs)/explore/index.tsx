import React from 'react';
import { useAuthWithAdminCheck } from '../../../hooks/useAuthWithAdminCheck';
import { ExploreInterface } from '../../../components/explore/ExploreInterface';

export default function ExploreIndex() {
  const { isAdmin } = useAuthWithAdminCheck();
  return <ExploreInterface isAdmin={isAdmin} />;
}
