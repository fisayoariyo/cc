import { formatNaira } from '@/lib/format';

export const AGENT_ONBOARDING_FEE_NGN = 5_000;

export const AGENT_ONBOARDING_PAYMENT_NOTICE =
  'Complete your onboarding payment to add and manage property listings.';

export function agentOnboardingPaymentNoticeText() {
  return `Complete your ${formatNaira(AGENT_ONBOARDING_FEE_NGN)} onboarding payment to add and manage property listings.`;
}

export const AGENT_ONBOARDING_BANK = {
  accountName: 'Dotcharis Global Consult',
  accountNumber: '1026143335',
  bank: 'UBA',
} as const;

/** WhatsApp support for payment receipts — official office line 0907 641 7113 */
export const AGENT_RECEIPT_WHATSAPP_E164 = '2349076417113';

export function formatAgentOnboardingBankLine() {
  const { accountName, accountNumber, bank } = AGENT_ONBOARDING_BANK;
  return `${accountName} ${accountNumber} ${bank}`;
}

export function buildAgentReceiptWhatsAppUrl(fullName: string | null | undefined) {
  const name = fullName?.trim() || 'Agent';
  const text = `Hello, my name is ${name} and this is my receipt`;
  return `https://wa.me/${AGENT_RECEIPT_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}
