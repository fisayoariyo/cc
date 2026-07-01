'use client';

import { DashboardSidebarAccountMenu } from '@/components/dashboard/dashboard-sidebar-account-menu';

export function AgentSidebarAccountMenu({
  fullName,
  photoUrl,
  fallbackLabel = 'Agent',
}: {
  fullName?: string | null;
  photoUrl?: string | null;
  fallbackLabel?: string;
}) {
  return (
    <DashboardSidebarAccountMenu
      fullName={fullName}
      photoUrl={photoUrl}
      fallbackLabel={fallbackLabel}
      logoutHref="/login"
      logoutDescription="Are you sure you want to log out? You will need to sign in again to access your agent dashboard."
    />
  );
}
