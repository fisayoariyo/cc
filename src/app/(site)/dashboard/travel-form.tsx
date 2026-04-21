'use client';

import { useActionState } from 'react';
import { createTravelApplication, type TravelFormState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TRAVEL_SERVICE_OPTIONS } from '@/lib/travel-stages';

export function TravelApplicationForm() {
  const [state, formAction, isPending] = useActionState<TravelFormState, FormData>(
    createTravelApplication,
    null,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-medium text-foreground">Start a travel application</h2>
      {state && 'error' in state ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}
      {state && 'success' in state && state.success ? (
        <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
          Application submitted. We&apos;ll update your status below as we progress.
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="service_type">Service type</Label>
        <select
          id="service_type"
          name="service_type"
          required
          className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base md:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TRAVEL_SERVICE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input id="destination" name="destination" required placeholder="Country or city" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Anything we should know" />
      </div>
      <Button type="submit" className="w-full rounded-full sm:w-auto" disabled={isPending}>
        {isPending ? 'Submitting…' : 'Submit application'}
      </Button>
    </form>
  );
}
