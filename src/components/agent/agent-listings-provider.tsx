'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { fetchAgentListings } from '@/app/(site)/agent/actions';
import type { PropertyRow } from '@/lib/types/database';

type AgentListingsContextValue = {
  rows: PropertyRow[];
  loading: boolean;
  refresh: () => void;
};

const AgentListingsContext = createContext<AgentListingsContextValue | null>(null);

let cachedRows: PropertyRow[] | null = null;
let inflight: Promise<PropertyRow[]> | null = null;

async function loadListings(force = false) {
  if (!force && cachedRows) return cachedRows;
  if (!force && inflight) return inflight;

  inflight = fetchAgentListings()
    .then((rows) => {
      cachedRows = rows;
      return rows;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function invalidateAgentListingsCache() {
  cachedRows = null;
  inflight = null;
}

export function AgentListingsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [rows, setRows] = useState<PropertyRow[]>(cachedRows ?? []);
  const [loading, setLoading] = useState(cachedRows === null);

  const refresh = useCallback(() => {
    invalidateAgentListingsCache();
    setLoading(true);
    void loadListings(true).then((next) => {
      setRows(next);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let active = true;

    // Show cache instantly, but always revalidate in the background so a remount
    // after a server-action redirect (e.g. saving a new draft) reflects fresh data.
    const hasCache = cachedRows !== null;
    void loadListings(hasCache).then((next) => {
      if (!active) return;
      setRows(next);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const prev = prevPathRef.current;
    const onListHub = pathname === '/agent' || pathname === '/agent/listings';

    // Refresh whenever we arrive on a hub page from a different route, so counts
    // and the listing grid always reflect the latest saved/submitted listings.
    if (onListHub && prev !== pathname) {
      refresh();
    }

    prevPathRef.current = pathname;
  }, [pathname, refresh]);

  const value = useMemo(
    () => ({
      rows,
      loading,
      refresh,
    }),
    [rows, loading, refresh],
  );

  return <AgentListingsContext.Provider value={value}>{children}</AgentListingsContext.Provider>;
}

export function useAgentListings() {
  const context = useContext(AgentListingsContext);
  if (!context) {
    throw new Error('useAgentListings must be used within AgentListingsProvider');
  }
  return context;
}
