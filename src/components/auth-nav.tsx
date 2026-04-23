'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

type ProfileRole = 'admin' | 'agent' | 'client';
export type AuthNavInitialState = {
  userId: string | null;
  role: ProfileRole | null;
  resolved: boolean;
};

function dashboardHref(role: ProfileRole | null): string {
  if (role === 'admin') return '/admin';
  if (role === 'agent') return '/agent';
  return '/dashboard';
}

export function AuthNav({
  navOnDarkImage,
  initialState,
}: {
  navOnDarkImage: boolean;
  initialState?: AuthNavInitialState;
}) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [userId, setUserId] = useState<string | null>(initialState?.userId ?? null);
  const [role, setRole] = useState<ProfileRole | null>(initialState?.role ?? null);
  const [loading, setLoading] = useState(initialState?.resolved ? false : true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }
    setSupabase(createClient());
  }, []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUserId(u?.id ?? null);
    if (u) {
      const { data } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle();
      setRole((data?.role as ProfileRole) ?? 'client');
    } else {
      setRole(null);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!initialState?.resolved) {
      void load();
    } else {
      setLoading(false);
    }
  }, [load, initialState?.resolved]);

  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        void load();
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, load]);

  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/contact');
    if (userId) {
      router.prefetch(dashboardHref(role));
    }
  }, [router, userId, role]);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.refresh();
    setUserId(null);
    setRole(null);
  };

  const muted = navOnDarkImage ? 'text-white/90 hover:text-white' : 'text-muted-foreground hover:text-primary';
  const active = navOnDarkImage ? 'text-white' : 'text-primary';

  if (!supabase || loading) {
    return (
      <div className="hidden md:flex items-center gap-3 min-h-[40px] min-w-[140px]">
        <span className={`text-sm ${muted}`}>…</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <Link href="/login" className={`text-sm font-medium ${muted}`}>
          Login
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <Link href={dashboardHref(role)} className={`text-sm font-medium ${active}`}>
        Dashboard
      </Link>
      <button type="button" onClick={() => void signOut()} className={`text-sm font-medium ${muted}`}>
        Sign out
      </button>
    </div>
  );
}

export function AuthNavMobile({
  onNavigate,
  initialState,
}: {
  onNavigate: () => void;
  initialState?: AuthNavInitialState;
}) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [userId, setUserId] = useState<string | null>(initialState?.userId ?? null);
  const [role, setRole] = useState<ProfileRole | null>(initialState?.role ?? null);
  const [ready, setReady] = useState(initialState?.resolved ? true : false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setReady(true);
      return;
    }
    setSupabase(createClient());
  }, []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUserId(u?.id ?? null);
    if (u) {
      const { data } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle();
      setRole((data?.role as ProfileRole) ?? 'client');
    } else {
      setRole(null);
    }
    setReady(true);
  }, [supabase]);

  useEffect(() => {
    if (!initialState?.resolved) {
      void load();
    }
  }, [load, initialState?.resolved]);

  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        void load();
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, load]);

  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/contact');
    if (userId) {
      router.prefetch(dashboardHref(role));
    }
  }, [router, userId, role]);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    onNavigate();
    router.refresh();
  };

  const link = 'text-muted-foreground';

  if (!supabase || !ready) {
    return <span className={`block text-sm ${link}`}>…</span>;
  }

  if (!userId) {
    return (
      <>
        <Link href="/login" className={`block text-base font-medium ${link}`} onClick={onNavigate}>
          Login
        </Link>
        <Link
          href="/contact"
          className="block w-full text-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full"
          onClick={onNavigate}
        >
          Contact Us
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href={dashboardHref(role)} className={`block text-base font-medium ${link}`} onClick={onNavigate}>
        Dashboard
      </Link>
      <button
        type="button"
        className={`block w-full text-left text-base font-medium ${link}`}
        onClick={() => void signOut()}
      >
        Sign out
      </button>
    </>
  );
}
