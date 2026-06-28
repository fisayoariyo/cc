/** Shared dashboard UI tokens — agent + admin (Charis purple + #FFBB3C accent). */

export const DASHBOARD_PURPLE = '#4b2e6f';
export const DASHBOARD_PURPLE_DARK = '#3d245c';
export const DASHBOARD_ORANGE = '#FFBB3C';
export const DASHBOARD_ORANGE_HOVER = '#f0ad2f';
export const DASHBOARD_SURFACE = '#f4f2f7';
export const DASHBOARD_MAIN_BG = '#fbfafc';

/** Buttons — softer corners, not pill-shaped. */
export const dashboardButtonRadiusClass = 'rounded-xl';
export const dashboardButtonRadiusSmClass = 'rounded-lg';

export const dashboardPrimaryButtonClass =
  `inline-flex items-center justify-center ${dashboardButtonRadiusClass} bg-[#4b2e6f] px-4 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#3d245c]`;

export const dashboardAccentButtonClass =
  `inline-flex items-center justify-center gap-2 ${dashboardButtonRadiusClass} bg-[#FFBB3C] px-4 py-2.5 font-sans text-sm font-semibold text-[#1F2A24] transition hover:bg-[#f0ad2f]`;

export const dashboardHeaderCtaClass =
  `inline-flex items-center justify-center gap-2 ${dashboardButtonRadiusClass} bg-[#FFBB3C] px-4 py-2.5 font-sans text-[15px] font-semibold text-[#1F2A24] transition hover:bg-[#f0ad2f]`;

export const dashboardHeaderCtaCompactClass =
  `inline-flex items-center justify-center gap-2 ${dashboardButtonRadiusSmClass} bg-[#FFBB3C] px-3 py-2 font-sans text-sm font-semibold text-[#1F2A24] transition hover:bg-[#f0ad2f]`;

export const dashboardOutlineButtonClass =
  `inline-flex items-center justify-center gap-2 ${dashboardButtonRadiusClass} border border-[#d7c8eb] bg-white px-4 py-2 font-sans text-sm font-medium text-[#4b2e6f] transition hover:bg-[#f7f3fb]`;

/** Page layout */
export const dashboardPageHeaderStackClass = 'space-y-1.5';

export const dashboardSubtitleClass = 'font-sans text-sm leading-relaxed text-[#6b7280]';
