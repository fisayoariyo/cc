export function splitNameParts(name: string) {
  return name.trim().split(/\s+/).filter(Boolean);
}

export function validateFirstLastName(
  firstName: string,
  lastName: string,
): { ok: true } | { ok: false; field: 'first' | 'last'; message: string } {
  const first = firstName.trim();
  const last = lastName.trim();

  if (!first) {
    return { ok: false, field: 'first', message: 'Please add your first name' };
  }
  if (!last) {
    return { ok: false, field: 'last', message: 'Please add your last name' };
  }
  return { ok: true };
}

export function validateFullNameSingleField(
  name: string,
): { ok: true } | { ok: false; message: string } {
  const parts = splitNameParts(name);
  if (parts.length === 0) {
    return { ok: false, message: 'Please add your first name' };
  }
  if (parts.length === 1) {
    return { ok: false, message: 'Please add your last name' };
  }
  return { ok: true };
}

export function validateNin(nin: string): { ok: true } | { ok: false; message: string } {
  const digits = nin.replace(/\D/g, '');
  if (digits.length === 0) {
    return { ok: false, message: 'Please enter your NIN' };
  }
  if (digits.length < 11) {
    return { ok: false, message: 'NIN must be 11 digits' };
  }
  if (digits.length > 11) {
    return { ok: false, message: 'NIN must be exactly 11 digits' };
  }
  return { ok: true };
}
