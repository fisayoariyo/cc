export function humanizeAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('email rate limit exceeded')) {
    return 'Too many emails were sent recently. Please wait a bit and try again.';
  }
  if (m.includes('user already registered')) {
    return 'This email is already registered. Please sign in instead.';
  }
  if (m.includes('invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  if (m.includes('email not confirmed')) {
    return 'Please confirm your email first, then sign in.';
  }
  if (m.includes('signup is disabled')) {
    return 'Signups are currently disabled for this project.';
  }
  if (m.includes('for security purposes, you can only request this after')) {
    return 'Please wait before requesting another reset email.';
  }
  return message;
}
