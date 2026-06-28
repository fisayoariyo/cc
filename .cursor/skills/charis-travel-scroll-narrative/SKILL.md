---
name: charis-travel-scroll-narrative
description: Implements Charis travel landing scroll narrative with airplane actor (takeoff, cruise, approach, landing) tied to visa journey chapters. Use for /travel page GSAP ScrollTrigger work, airplane parallax, or long-vehicle-style scroll motion references.
---

# Charis Travel Scroll Narrative (Airplane Journey)

## Reference intent

User reference: long vehicle moving through page sections on scroll.

Charis translation: **airplane actor** travels a scroll path across visa journey chapters — takeoff → services cruise → destination approach → landing CTA.

Load **charis-gsap-foundation** first, then **gsap-scrolltrigger** + **gsap-react**.

## Target route

- Page: `src/components/pages/TravelPage.tsx`
- New orchestrator: `src/components/pages/travel/TravelScrollNarrative.tsx`
- Insert after hero (`CinematicHero`) or replace middle sections progressively

## Chapter map

| # | Chapter ID | Scroll behavior | Airplane state | Business meaning |
|---|------------|-----------------|----------------|------------------|
| 0 | `runway` | Hero overlap, subtle drift | Parked / engine idle | Brand + journey start |
| 1 | `takeoff` | Pin 140vh, scrub climb | Rise + slight bank | Account created / brief submitted |
| 2 | `cruise` | Horizontal path through service cards | Level flight, passes icons | Visa advisory, docs, interview prep |
| 3 | `approach` | Descent + destination cards highlight | Descend + slow | Application review milestones |
| 4 | `landing` | Final pin, CTA reveal | Touchdown + fade | Open travel dashboard / register |

See [chapter-map.md](chapter-map.md) for DOM hooks and timeline keyframes.

## DOM structure

```tsx
<div ref={rootRef} className="relative">
  {/* Fixed/SVG actor layer */}
  <div
    data-narrative-actor="airplane"
    aria-hidden
    className="pointer-events-none fixed left-0 top-0 z-20 h-16 w-16 md:h-24 md:w-24"
  >
    {/* SVG plane or optimized PNG/WebP */}
  </div>

  <section data-chapter="takeoff" className="relative min-h-[140vh]">
    <div data-chapter-pin className="sticky top-0 flex min-h-screen items-center">
      <div data-chapter-content>...</div>
    </div>
  </section>

  {/* repeat for cruise, approach, landing */}
</div>
```

## Timeline skeleton (desktop)

```tsx
useGSAP(
  () => {
    const plane = rootRef.current?.querySelector('[data-narrative-actor="airplane"]');
    if (!plane) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-chapter="takeoff"]',
        start: 'top top',
        end: '+=140%',
        pin: '[data-chapter="takeoff"] [data-chapter-pin]',
        scrub: 1,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      plane,
      { x: '10vw', y: '70vh', rotation: 0, opacity: 1 },
      { x: '45vw', y: '25vh', rotation: -8, ease: 'none' },
    )
      .to('[data-chapter="takeoff"] [data-step="1"]', { opacity: 1, y: 0, stagger: 0.08 }, 0.2)
      .to('[data-chapter="takeoff"] [data-step="2"]', { opacity: 1, y: 0 }, 0.45);
  },
  { scope: rootRef },
);
```

## Cruise chapter (meaningful motion)

Use **containerAnimation** or chained x-translate so plane visually “passes” service pillars:

```tsx
gsap.to(plane, {
  x: '80vw',
  ease: 'none',
  scrollTrigger: {
    trigger: '[data-chapter="cruise"]',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
  },
});

gsap.utils.toArray('[data-service-card]').forEach((card, i) => {
  gsap.from(card as Element, {
    opacity: 0.35,
    scale: 0.96,
    scrollTrigger: {
      trigger: card as Element,
      start: 'left 80%',
      end: 'left 40%',
      scrub: true,
      horizontal: true, // if using horizontal track
    },
  });
});
```

On mobile: disable horizontal scrub; stack cards vertically; plane becomes static icon in section header.

## Content copy hooks (keep on-brand)

- Takeoff: “Your visa journey starts with one clear plan.”
- Cruise: “Documents, advisory, interview prep — in one flow.”
- Approach: “Track every milestone until decision.”
- Landing CTA: `/register?role=client&service=travel` and `/login?role=client&service=travel`

## Assets

- Prefer inline SVG airplane (stroke/fill `#500085` / cream accents)
- Optional contrail: pseudo-element with opacity tied to scroll velocity
- Do not use heavy video in scroll path

## Performance

- Single actor element reused across chapters (never duplicate plane nodes)
- `will-change: transform` on actor only during active chapter
- Kill timelines on unmount via `useGSAP` (automatic)

## Implementation order

1. Add `TravelScrollNarrative.tsx` with chapters 1–2 only (takeoff + cruise)
2. Wire into `TravelPage.tsx` below hero
3. Add approach + landing
4. Mobile/reduced-motion pass
5. Remove redundant Framer scroll duplicates in migrated sections

## Do not

- Pin the global `Navigation` component
- Animate filter/blur on scrub
- Block CTA clicks with actor layer (`pointer-events-none` on actor)
