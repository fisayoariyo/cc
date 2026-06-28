export function formatAgentLocation(state: string | null, lga: string | null) {
  if (!state && !lga) return null;
  const stateLabel = state ? `${state} state` : '';
  const lgaLabel = lga ? `${lga} local government` : '';
  return [stateLabel, lgaLabel].filter(Boolean).join(', ');
}
