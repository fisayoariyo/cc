---
name: charis-gsap-foundation
description: Charis Consult GSAP standards for Next.js 15 App Router scroll narratives. Use when adding GSAP to travel/construction landing pages, ScrollTrigger chapters, useGSAP cleanup, reduced-motion fallbacks, or migrating from Framer Motion scroll sections.
---

# Charis GSAP Foundation

## When to use

Apply before any Charis scroll narrative work (travel airplane journey, construction build climb).

Also load official plugin skills when needed:
- **gsap-react** — `useGSAP`, refs, cleanup
- **gsap-scrolltrigger** — pin, scrub, triggers
- **gsap-timeline** — chapter sequencing
- **gsap-performance** — transform-only animation

## Stack rules (Charis)

- Next.js 15 App Router, TypeScript strict
- Client-only animation: `'use client'` + dynamic import for heavy sections if SSR issues
- Packages: `gsap`, `@gsap/react`
- Prefer GSAP for **scroll-scrubbed multi-chapter narratives**
- Keep Framer Motion for **simple** `whileInView` fades unless migrating

## File layout (reuse every time)

```
src/lib/gsap/
  register-client.ts      # register ScrollTrigger + useGSAP once
  reduced-motion.ts       # matchMedia helper
src/components/gsap/
  ScrollChapter.tsx       # pinned section wrapper (optional)
  NarrativeProgressRail.tsx
src/hooks/
  use-charis-scroll-narrative.ts
```

Page-specific orchestrators:
- `src/components/pages/travel/TravelScrollNarrative.tsx`
- `src/components/pages/construction/ConstructionScrollNarrative.tsx` (or extend `ConstructionPage.tsx`)

## Registration (required once per client bundle)

```ts
// src/lib/gsap/register-client.ts
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;

export function registerCharisGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
}
```

Call `registerCharisGsap()` at top of each narrative client component.

## useGSAP pattern (mandatory)

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { registerCharisGsap } from '@/lib/gsap/register-client';

registerCharisGsap();

export function ExampleNarrative() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // all ScrollTriggers scoped here
    },
    { scope: rootRef, dependencies: [] },
  );

  return <div ref={rootRef}>...</div>;
}
```

Never create global ScrollTriggers without scope. Always rely on `useGSAP` cleanup.

## Animation constraints (Charis lead standard)

1. Animate only `transform` and `opacity` (plus `clipPath` sparingly)
2. No width/height/top/left tweens on scroll-scrubbed sections
3. One primary motion idea per chapter
4. Desktop: pin + scrub; mobile: stacked static chapters (no pin jank)
5. `prefers-reduced-motion`: disable pin/scrub; show final states instantly

```ts
// src/lib/gsap/reduced-motion.ts
import gsap from 'gsap';

export function charisMatchMedia(scope: HTMLElement, setup: () => void) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', setup, scope);
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(scope.querySelectorAll('[data-chapter-content]'), { clearProps: 'all' });
  });
  return mm;
}
```

## ScrollTrigger defaults (Charis)

| Setting | Desktop | Mobile |
|---------|---------|--------|
| `scrub` | `0.8–1.2` | off |
| `pin` | chapter shell | off |
| `anticipatePin` | `1` | n/a |
| `invalidateOnRefresh` | `true` | `true` |

Refresh after images load:

```ts
ScrollTrigger.refresh();
window.addEventListener('load', () => ScrollTrigger.refresh());
```

## Narrative chapter contract

Each chapter must expose:

```tsx
<section data-chapter="consultation" data-chapter-index="1" className="relative min-h-[120vh]">
  <div data-chapter-pin className="sticky ...">...</div>
  <div data-chapter-content>...</div>
  <div data-narrative-actor data-actor-state="cruise">...</div>
</section>
```

- `data-chapter` — semantic id for timeline labels
- `data-narrative-actor` — moving airplane / crane / building spine
- `data-chapter-content` — text/cards revealed by scroll progress

## When to choose GSAP vs Framer Motion

| Need | Library |
|------|---------|
| Scroll-scrubbed 3+ chapter story | GSAP + ScrollTrigger |
| Pinned timeline with progress-linked UI | GSAP |
| Simple fade/slide on enter viewport | Framer Motion OK |
| Hero carousel | Keep existing Framer/dynamic hero |

## QA checklist

- [ ] No ScrollTrigger leaks on route change
- [ ] Mobile has readable static fallback
- [ ] Reduced motion respected
- [ ] Lighthouse: no layout shift from pin spacing
- [ ] CTA links unchanged (`/register?role=client&service=...`)

## Related skills

- Travel airplane journey: [charis-travel-scroll-narrative](../charis-travel-scroll-narrative/SKILL.md)
- Construction build climb: [charis-construction-scroll-narrative](../charis-construction-scroll-narrative/SKILL.md)
