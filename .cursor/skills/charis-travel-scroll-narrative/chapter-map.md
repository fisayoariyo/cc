# Travel Airplane Chapter Map

## Actor keyframes (viewport-relative)

| Progress | x | y | rotation | Notes |
|----------|---|---|----------|-------|
| Runway 0% | 12vw | 72vh | 0° | Idle |
| Takeoff 30% | 35vw | 50vh | -4° | Lift |
| Takeoff 100% | 55vw | 18vh | -10° | Climb complete |
| Cruise 0% | 8vw | 28vh | -2° | Level |
| Cruise 100% | 88vw | 28vh | 2° | Pass services |
| Approach 50% | 50vw | 40vh | 6° | Descent |
| Landing 100% | 50vw | 68vh | 0° | Touchdown |

Tune with `gsap.utils.clamp()` — never hardcode without `invalidateOnRefresh`.

## data-step reveals (takeoff)

```html
<div data-step="1">Create travel account</div>
<div data-step="2">Upload documents</div>
<div data-step="3">Book advisory call</div>
```

Scrub stagger: 0.08–0.12 between steps.

## Service cards (cruise)

Map existing `TravelPage` services to `data-service-card` + `data-service-index`.

Highlight active card when plane x crosses card center (optional `onUpdate` callback).
