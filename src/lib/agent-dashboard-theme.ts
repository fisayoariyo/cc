/** Agent dashboard UI tokens — HFEI layout, Charis purple + #FFBB3C accent. */

import {
  dashboardAccentButtonClass,
  dashboardButtonRadiusClass,
  dashboardButtonRadiusSmClass,
  dashboardHeaderCtaClass,
  dashboardHeaderCtaCompactClass,
  dashboardPageHeaderStackClass,
  dashboardPrimaryButtonClass,
  dashboardSubtitleClass,
  DASHBOARD_MAIN_BG,
  DASHBOARD_ORANGE,
  DASHBOARD_ORANGE_HOVER,
  DASHBOARD_PURPLE,
  DASHBOARD_PURPLE_DARK,
  DASHBOARD_SURFACE,
} from '@/lib/dashboard-theme';

export const AGENT_DASHBOARD_PURPLE = DASHBOARD_PURPLE;
export const AGENT_DASHBOARD_PURPLE_DARK = DASHBOARD_PURPLE_DARK;
export const AGENT_DASHBOARD_ORANGE = DASHBOARD_ORANGE;
export const AGENT_DASHBOARD_ORANGE_HOVER = DASHBOARD_ORANGE_HOVER;
export const AGENT_DASHBOARD_ORANGE_TEXT = '#c88700';
export const AGENT_DASHBOARD_SURFACE = DASHBOARD_SURFACE;
export const AGENT_DASHBOARD_MAIN_BG = DASHBOARD_MAIN_BG;
export const AGENT_DASHBOARD_CARD = '#ffffff';

/** Buttons — re-export shared dashboard tokens. */
export const agentButtonRadiusClass = dashboardButtonRadiusClass;
export const agentButtonRadiusSmClass = dashboardButtonRadiusSmClass;

export const agentPrimaryButtonClass = dashboardPrimaryButtonClass;

export const agentAccentButtonClass =
  `flex w-full items-center justify-center gap-2 ${dashboardButtonRadiusClass} bg-[#FFBB3C] px-4 py-3 font-sans text-sm font-semibold text-[#1F2A24] transition hover:bg-[#f0ad2f]`;

export const agentHeaderCtaClass = dashboardHeaderCtaClass;
export const agentHeaderCtaCompactClass = dashboardHeaderCtaCompactClass;

export const agentPaymentButtonClass =
  `mt-4 flex h-12 w-full max-w-sm items-center justify-center gap-2 ${agentButtonRadiusClass} bg-[#FFBB3C] px-6 font-sans text-sm font-semibold text-[#1F2A24] transition hover:bg-[#f0ad2f]`;

/** Shared page layout — matches Settings / Help spacing on mobile + desktop. */
export const agentPageShellClass = 'w-full max-w-2xl space-y-6';

export const agentPageHeaderStackClass = dashboardPageHeaderStackClass;

export const agentSubtitleClass = dashboardSubtitleClass;

/** Inline notice (no card background) — payment reminders, alerts. */
export const agentNoticeClass =
  'border-l-4 border-[#FFBB3C] py-0.5 pl-4 font-sans text-sm leading-relaxed text-[#6b7280]';

export const agentContentStackClass = 'space-y-4 lg:space-y-6';

/** Action panels: white card on mobile, flat on grey desktop. */
export const agentSurfacePanelClass =
  'rounded-2xl border border-[#ece8f2] bg-white p-4 shadow-sm lg:border-[#ece8f2] lg:bg-transparent lg:shadow-none';

export const agentBankDetailClass =
  'max-w-md rounded-xl border border-[#ece8f2] bg-transparent px-4 py-3 font-sans text-sm font-semibold leading-snug text-[#1F2A24]';

export const agentWhatsAppButtonClass =
  `flex h-12 w-full max-w-sm shrink-0 items-center justify-center gap-2 ${agentButtonRadiusClass} bg-[#FFBB3C] px-4 py-3 font-sans text-sm font-semibold text-[#1F2A24] no-underline transition hover:bg-[#f0ad2f]`;

/** Form fields on agent dashboard — white surface + clear border (Help & Support reference). */
export const AGENT_FORM_LABEL_CLASS = 'font-sans text-sm font-semibold text-[#1F2A24]';

export const AGENT_FORM_FIELD_CLASS =
  'h-12 w-full rounded-xl border border-[#d1d5db] bg-white px-4 font-sans text-sm text-[#111827] shadow-sm placeholder:text-[#9ca3af] focus-visible:border-[#4b2e6f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b2e6f]/20';

export const AGENT_FORM_TEXTAREA_CLASS =
  'min-h-[120px] w-full resize-y rounded-xl border border-[#d1d5db] bg-white px-4 py-3 font-sans text-sm text-[#111827] shadow-sm placeholder:text-[#9ca3af] focus-visible:border-[#4b2e6f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b2e6f]/20';

export const AGENT_FORM_SELECT_CLASS =
  'dropdown-field h-12 w-full appearance-none rounded-xl border border-[#d1d5db] bg-white px-4 font-sans text-sm text-[#111827] shadow-sm focus-visible:border-[#4b2e6f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b2e6f]/20';

