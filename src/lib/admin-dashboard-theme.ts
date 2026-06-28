/** Admin dashboard UI tokens — same palette as agent (#4b2e6f + #FFBB3C on #fbfafc). */

export {
  DASHBOARD_MAIN_BG as ADMIN_DASHBOARD_MAIN_BG,
  DASHBOARD_ORANGE as ADMIN_DASHBOARD_ORANGE,
  DASHBOARD_PURPLE as ADMIN_DASHBOARD_PURPLE,
  DASHBOARD_SURFACE as ADMIN_DASHBOARD_SURFACE,
  dashboardAccentButtonClass as adminAccentButtonClass,
  dashboardButtonRadiusClass as adminButtonRadiusClass,
  dashboardHeaderCtaClass as adminHeaderCtaClass,
  dashboardOutlineButtonClass as adminOutlineButtonClass,
  dashboardPageHeaderStackClass as adminPageHeaderStackClass,
  dashboardPrimaryButtonClass as adminPrimaryButtonClass,
  dashboardSubtitleClass as adminSubtitleClass,
} from '@/lib/dashboard-theme';

export {
  AGENT_FORM_FIELD_CLASS as ADMIN_FORM_FIELD_CLASS,
  AGENT_FORM_SELECT_CLASS as ADMIN_FORM_SELECT_CLASS,
  agentSurfacePanelClass as adminSurfacePanelClass,
} from '@/lib/agent-dashboard-theme';

export const adminContentStackClass = 'space-y-4 lg:space-y-6';

export const adminTablePanelClass =
  'overflow-x-auto rounded-2xl border border-[#ece8f2] bg-white shadow-sm';

export const adminFilterBarClass = 'grid gap-2.5';

/** Compact filter controls — smaller than the tall form fields used on data-entry pages. */
export const ADMIN_FILTER_FIELD_CLASS =
  'h-10 w-full rounded-lg border border-[#d1d5db] bg-white px-3 font-sans text-sm text-[#111827] placeholder:text-[#9ca3af] focus-visible:border-[#4b2e6f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b2e6f]/20';

export const ADMIN_FILTER_SELECT_CLASS =
  'dropdown-field h-10 w-full appearance-none rounded-lg border border-[#d1d5db] bg-white px-3 font-sans text-sm text-[#111827] focus-visible:border-[#4b2e6f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b2e6f]/20';

export const adminFilterButtonClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FFBB3C] px-4 font-sans text-sm font-semibold text-[#1F2A24] transition hover:bg-[#f0ad2f]';

export const adminFilterResetClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d7c8eb] bg-white px-4 font-sans text-sm font-medium text-[#4b2e6f] transition hover:bg-[#f7f3fb]';

export const adminStatCardClass =
  'rounded-2xl bg-[#4b2e6f] p-4 text-white transition-transform hover:-translate-y-0.5';

export const adminQuickLinkClass =
  'flex items-center justify-between gap-3 rounded-2xl border border-[#ece8f2] bg-white p-4 transition-colors hover:border-[#cdbde2] lg:border-[#ece8f2] lg:bg-transparent lg:shadow-none';
