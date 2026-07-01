type ClientService = 'travel' | 'real_estate' | 'construction';

export function clientServiceFromPath(pathname: string): ClientService | undefined {
  if (pathname.startsWith('/travel/dashboard') || pathname.startsWith('/travels/dashboard')) {
    return 'travel';
  }
  if (pathname.startsWith('/real-estate/construction/dashboard')) {
    return 'construction';
  }
  if (pathname.startsWith('/real-estate/dashboard')) {
    return 'real_estate';
  }
  return undefined;
}

export function isAgentPath(pathname: string) {
  return pathname.startsWith('/agent');
}

/** Attach role/service hints so /login renders the correct branded shell. */
export function applyLoginContextParams(url: URL, nextPath: string) {
  if (isAgentPath(nextPath)) {
    url.searchParams.set('role', 'agent');
    return;
  }

  const service = clientServiceFromPath(nextPath);
  if (service) {
    url.searchParams.set('role', 'client');
    url.searchParams.set('service', service);
  }
}

export function buildLoginRedirectPath(nextPath: string, error?: string) {
  const params = new URLSearchParams({ next: nextPath });
  const url = new URL('http://local/login');
  url.search = params.toString();
  applyLoginContextParams(url, nextPath);
  if (error) {
    url.searchParams.set('error', error);
  }
  return `${url.pathname}?${url.searchParams.toString()}`;
}

export function buildPortalLoginHref(input: {
  role: 'client' | 'agent';
  service?: ClientService;
  defaultNext: string;
  preserve?: { next?: string; error?: string; message?: string };
}) {
  const params = new URLSearchParams();
  params.set('role', input.role);
  if (input.service) params.set('service', input.service);
  params.set('next', input.preserve?.next ?? input.defaultNext);
  if (input.preserve?.error) params.set('error', input.preserve.error);
  if (input.preserve?.message) params.set('message', input.preserve.message);
  return `/login?${params.toString()}`;
}

/** Branded login form requires role=agent or role=client with an explicit service. */
export function hasBrandedLoginContext(input: { role?: string; service?: ClientService }): boolean {
  if (input.role === 'agent') return true;
  if (input.role === 'client' && input.service) return true;
  return false;
}

export function shouldShowLoginPicker(input: { role?: string; service?: ClientService }): boolean {
  return !hasBrandedLoginContext(input);
}

export function parseExplicitClientService(service?: string): ClientService | undefined {
  if (service === 'travel' || service === 'real_estate' || service === 'construction') {
    return service;
  }
  return undefined;
}
