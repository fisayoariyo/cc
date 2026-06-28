'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { ProfileAvatar } from '@/components/dashboard/profile-avatar';
import { createClient } from '@/lib/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DashboardSidebarAccountMenu({
  fullName,
  photoUrl,
  fallbackLabel,
  logoutHref = '/',
  logoutDescription = 'You will be signed out of your account and need to sign in again to continue.',
}: {
  fullName?: string | null;
  photoUrl?: string | null;
  fallbackLabel: string;
  logoutHref?: string;
  logoutDescription?: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setPending(false);
      setConfirmOpen(false);
      router.push(logoutHref);
      router.refresh();
    }
  }

  return (
    <>
      <div className="mt-8 rounded-xl border border-border/70 bg-[#fbfafc] px-3 py-3">
        <div className="flex items-start gap-3">
          <ProfileAvatar photoUrl={photoUrl} name={fullName} className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-[#f4f2f7] hover:text-foreground"
                aria-label="Log out"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className="truncate text-sm font-medium text-foreground">{fullName || fallbackLabel}</p>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>{logoutDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleLogout();
              }}
              disabled={pending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {pending ? 'Logging out…' : 'Log out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
