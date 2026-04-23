'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MoreHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export function SidebarAccountMenu({
  fullName,
  fallbackLabel,
}: {
  fullName?: string | null;
  fallbackLabel: string;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setPending(false);
      setDialogOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  return (
    <>
      <div className="mt-8 rounded-xl border border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Open account menu"
              >
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  setDialogOpen(true);
                }}
              >
                <LogOut size={14} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm font-medium text-foreground truncate">{fullName || fallbackLabel}</p>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account and returned to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleLogout()} disabled={pending}>
              {pending ? 'Logging out…' : 'Log out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
