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
