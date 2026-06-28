# Construction Build Chapter Map

## Milestone spine nodes (match dashboard stages)

1. Foundation  
2. Ground Slab  
3. Lintel  
4. Roofing  
5. Internal Finishes  
6. Handover  

Map to `CONSTRUCTION_STAGES` in `src/lib/construction-stages.ts` for consistency with client dashboard.

## Scroll scrub ranges

| Chapter | end (scroll distance) | pin |
|---------|----------------------|-----|
| boq-lock | +=100% | optional |
| scenario | +=80% | no |
| milestone-climb | +=220% | yes |
| delay-radar | +=60% | no |
| control-panel | +=70% | no |

## Artifact panel crossfade

For each node activation, swap `[data-artifact-panel]` content with:

```tsx
gsap.to(panel, { opacity: 0, y: 12, duration: 0.15, onComplete: () => {
  // update text
  gsap.to(panel, { opacity: 1, y: 0, duration: 0.25 });
}});
```

Prefer single timeline label per milestone: `tl.addLabel('lintel', 0.45)`.

## Reduced motion fallback

Show all spine nodes active + final artifact text; disable pin on `[data-chapter="milestone-climb"]`.
