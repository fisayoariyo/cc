export const RESET_PHONE_KEY = 'charis_reset_phone';

export function normalizeAgentPhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

export function maskPhoneForDisplay(e164: string) {
  const digits = e164.replace(/\D/g, '');
  const local = digits.startsWith('234') ? digits.slice(3) : digits;
  if (local.length < 4) return local;
  return `0${local}`;
}
