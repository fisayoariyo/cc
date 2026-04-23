export const LAST_CLIENT_SERVICE_COOKIE = 'charis_last_client_service';
export const LAST_CLIENT_SERVICE_MAX_AGE = 60 * 60 * 24 * 30;

export function isClientDashboardService(value: string | undefined): value is 'travel' | 'real_estate' {
  return value === 'travel' || value === 'real_estate';
}
