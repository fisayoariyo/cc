---
name: charis-gsap-index
description: Index of Charis Consult project GSAP skills for travel and construction scroll narratives. Use when starting GSAP animation work in this repo to pick the correct skill.
---

# Charis GSAP Skills Index

## Load order

1. [charis-gsap-foundation](charis-gsap-foundation/SKILL.md) — always first
2. Page skill:
   - Travel: [charis-travel-scroll-narrative](charis-travel-scroll-narrative/SKILL.md)
   - Construction: [charis-construction-scroll-narrative](charis-construction-scroll-narrative/SKILL.md)
3. Official plugin skills as needed: `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`

## Shared code

| File | Purpose |
|------|---------|
| `src/lib/gsap/register-client.ts` | Plugin registration |
| `src/lib/gsap/reduced-motion.ts` | matchMedia + pin defaults |
| `src/hooks/use-charis-scroll-narrative.ts` | Multi-chapter timeline hook |

## Invoke in chat

- “Use **charis-travel-scroll-narrative** to add airplane scroll chapters to TravelPage”
- “Use **charis-construction-scroll-narrative** to migrate milestone climb to GSAP”

## Video references (design intent)

- Travel: long vehicle / journey motion → airplane takeoff → cruise → landing
- Construction: build progressing on scroll → spine + milestone climb + BOQ chapters

Store reference clips in `docs/references/` if added to repo (optional).
