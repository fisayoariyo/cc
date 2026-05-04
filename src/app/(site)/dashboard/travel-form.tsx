'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { createTravelApplication, type TravelFormState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTravelServiceChoice, normalizeTravelServiceType } from '@/lib/travel-stages';

export function TravelApplicationForm({
  initialServiceType,
  createdApplicationId,
}: {
  initialServiceType?: string;
  createdApplicationId?: string;
}) {
  const defaultService = normalizeTravelServiceType(initialServiceType);
  const selectedService =
    defaultService === 'education' || defaultService === 'immigration' || defaultService === 'tourism'
      ? defaultService
      : null;
  const [state, formAction, isPending] = useActionState<TravelFormState, FormData>(
    createTravelApplication,
    null,
  );
  const selectedFlow = selectedService ? getTravelServiceChoice(selectedService) : null;

  if (!selectedFlow) {
    return null;
  }

  if (createdApplicationId) {
    return null;
  }

  return (
    <form id="start-application" action={formAction} className="space-y-5">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
          <Sparkles className="h-3.5 w-3.5" />
          Start {selectedFlow.shortLabel} application
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground sm:text-[2rem]">{selectedFlow.label}</h2>
          <p className="text-[15px] text-muted-foreground sm:text-[17px]">{selectedFlow.description}</p>
        </div>
      </div>

      {state && 'error' in state ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[15px] text-destructive">
          {state.error}
        </div>
      ) : null}

      <input type="hidden" name="service_type" value={selectedFlow.value} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-[15px]">
            {selectedFlow.destinationLabel}
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="destination"
              name="destination"
              required
              placeholder="Enter country, city, or preferred destination"
              className="h-12 rounded-2xl border-border/70 bg-card pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-[15px]">
            Tell us a little more
          </Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder={selectedFlow.notesPlaceholder}
            className="min-h-[48px] rounded-2xl border-border/70 bg-card"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="rounded-full bg-[#c88a2d] text-white hover:bg-[#b67b25]" disabled={isPending}>
          {isPending ? 'Creating application...' : `Start ${selectedFlow.shortLabel} application`}
        </Button>
        <Link href="/travel/dashboard" className="text-[15px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Choose a different travel type from dashboard
        </Link>
      </div>
    </form>
  );
}
