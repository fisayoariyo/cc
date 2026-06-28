---
name: charis-construction-scroll-narrative
description: Implements Charis construction landing scroll narrative with building spine, BOQ lock, scenario simulator, and milestone climb using GSAP ScrollTrigger. Use for /real-estate/construction page scroll animations, construction-as-you-scroll, or Direction A chapter migrations from Framer Motion.
---

# Charis Construction Scroll Narrative (Build in Public)

## Reference intent

User reference: construction visibly progressing as user scrolls (site mobilization → structure rising → handover).

Aligns with **Direction A** chapters already in `ConstructionPage.tsx`. Migrate scroll-scrubbed sections from Framer Motion to GSAP for smoother pin/scrub control.

Load **charis-gsap-foundation** first, then **gsap-scrolltrigger** + **gsap-timeline**.

## Target route

- Page: `src/components/pages/ConstructionPage.tsx`
- Optional split: `src/components/pages/construction/ConstructionScrollNarrative.tsx`

## Chapter map (existing content → GSAP)

| # | Chapter ID | Current section | Primary motion | Actor |
|---|------------|-----------------|----------------|-------|
| 0 | `mobilization` | Hero | Parallax scale (keep subtle) | Site photo |
| 1 | `boq-lock` | BOQ Lock | Line items step in on scrub | BOQ meter fill |
| 2 | `scenario` | Scenario Simulator | Slider values drive preview numbers | Risk ring pulse |
| 3 | `milestone-climb` | Milestone Climb (sticky) | **Building spine grows** | Floor nodes light up |
| 4 | `delay-radar` | Delay Radar | Chips orbit → settle | Amber pulse on risk |
| 5 | `control-panel` | Client Control Panel | Dashboard card slide-in | CTA emphasis |

See [chapter-map.md](chapter-map.md) for spine math and scrub ranges.

## Building spine (hero mechanic)

Center vertical spine represents structure rising:

```tsx
<div data-narrative-actor="building-spine" className="relative mx-auto h-[420px] w-2 bg-[#E9E2F2]">
  {milestones.map((m, i) => (
    <div
      key={m.title}
      data-spine-node={i}
      className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#CFBCD9]"
      style={{ top: `${(i / (milestones.length - 1)) * 100}%` }}
    />
  ))}
  <div data-spine-fill className="absolute bottom-0 w-full origin-bottom bg-[#3B0063]" />
</div>
```

Timeline (milestone-climb chapter):

```tsx
const climbTl = gsap.timeline({
  scrollTrigger: {
    trigger: '[data-chapter="milestone-climb"]',
    start: 'top top',
    end: '+=220%',
    pin: '[data-chapter="milestone-climb"] [data-chapter-pin]',
    scrub: 1,
    anticipatePin: 1,
  },
});

climbTl.to('[data-spine-fill]', { scaleY: 1, ease: 'none' }, 0);

milestones.forEach((_, i) => {
  const at = i / milestones.length;
  climbTl.to(`[data-spine-node="${i}"]`, { backgroundColor: '#3B0063', scale: 1.2 }, at);
  climbTl.to(`[data-milestone-panel="${i}"]`, { opacity: 1, y: 0 }, at + 0.02);
});
```

Sync `activeMilestone` React state via `onUpdate`:

```tsx
onUpdate: (self) => {
  const idx = Math.min(milestones.length - 1, Math.floor(self.progress * milestones.length));
  setActiveMilestone(idx);
},
```

## BOQ lock chapter

- Pin optional (shorter: 100vh)
- Scrub BOQ rows with stagger tied to progress (not `whileInView`)
- Animate confidence meter width with `gsap.to(meter, { width: '86%', ease: 'none' })` on same timeline

## Scenario simulator chapter

**Do not scrub HTML range inputs** — they are user-controlled.

Instead:
- On `input` change: `gsap.to(previewNumbers, { duration: 0.35, ease: 'power2.out' })` for number morph feel
- Optional: subtle `gsap.fromTo(riskBar, { scaleX: 0.8 }, { scaleX: 1 })` when risk score crosses thresholds

ScrollTrigger here only pins section header + reveals left/right columns once.

## Delay radar

Orbit pattern (desktop only):

```tsx
gsap.from('[data-risk-chip]', {
  x: (i) => 40 + i * 20,
  opacity: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '[data-chapter="delay-radar"]',
    start: 'top 70%',
    end: 'top 30%',
    scrub: 0.6,
  },
});
```

## Colors (construction accent)

- Primary: `#3B0063`
- Hover: `#2E004D`
- Surface: `#FEFAF4`, `#FFFDF9`
- Border: `#E9E2F2`

## Migration from Framer Motion

Replace in `ConstructionPage.tsx`:
- `useScroll` / `useTransform` hero scale → GSAP parallax tween OR keep Framer for hero only
- `useMotionValueEvent` milestone logic → ScrollTrigger `onUpdate`
- `whileInView` cards → scroll-scrubbed timeline segments

Keep `'use client'` on page or split narrative to dynamic import.

## CTAs (do not break)

- Register: `/register?role=client&service=construction`
- Dashboard: `/real-estate/construction/dashboard`
- Consultation: `CONSTRUCTION_CONSULTATION_URL`

## Implementation order

1. Install + `registerCharisGsap()` (see foundation skill)
2. Migrate **milestone-climb** only (highest impact)
3. BOQ lock scrub
4. Delay radar + control panel reveals
5. Scenario simulator micro-tweens on slider change
6. Mobile/reduced-motion fallbacks

## QA

- [ ] Spine progress matches admin milestone order in dashboard
- [ ] No double-pin between chapters
- [ ] Simulator sliders remain interactive while pinned content animates around them
