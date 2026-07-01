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

export function buildLoginPickerHref(preserve?: {
  next?: string;
  error?: string;
  message?: string;
}) {
  const params = new URLSearchParams();
  if (preserve?.next) params.set('next', preserve.next);
  if (preserve?.error) params.set('error', preserve.error);
  if (preserve?.message) params.set('message', preserve.message);
  const qs = params.toString();
  return qs ? `/login?${qs}` : '/login';
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

export function shouldShowLoginPicker(input: {
  role?: string;
  resolvedService?: ClientService;
  nextPath?: string;
}): boolean {
  if (input.role === 'agent' || input.nextPath?.startsWith('/agent')) {
    return false;
  }
  if (input.role === 'client' && input.resolvedService) {
    return false;
  }
  if (input.resolvedService) {
    return false;
  }
  return true;
}

export function serviceFromLoginContext(input: {
  role?: string;
  service?: string;
  nextPath?: string;
}): ClientService | undefined {
  if (input.service === 'travel' || input.service === 'real_estate' || input.service === 'construction') {
    return input.service;
  }
  if (input.nextPath) {
    return clientServiceFromPath(input.nextPath);
  }
  return undefined;
}
