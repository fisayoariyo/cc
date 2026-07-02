/**
 * Converts raw Supabase/Postgres error messages into safe, user-facing copy.
 * Never surface constraint names, column names, or SQL details to end users.
 */
export function friendlyDbError(
  error: { message?: string | null; code?: string | null } | null | undefined,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!error) return fallback;

  const code = error.code ?? '';
  const message = (error.message ?? '').toLowerCase();

  // Unique violation
  if (code === '23505' || message.includes('duplicate key') || message.includes('unique constraint')) {
    return 'That record already exists. Please refresh and try again.';
  }
  // Foreign key violation
  if (code === '23503' || message.includes('foreign key')) {
    return 'A related record is missing. Please refresh and try again.';
  }
  // Not-null violation
  if (code === '23502' || message.includes('null value')) {
    return 'Some required information is missing. Please complete all fields.';
  }
  // Check violation
  if (code === '23514' || message.includes('check constraint')) {
    return 'Some of the information provided is not valid. Please review and try again.';
  }
  // RLS / permission
  if (
    code === '42501' ||
    message.includes('row-level security') ||
    message.includes('permission denied')
  ) {
    return 'You do not have permission to perform this action.';
  }

  return fallback;
}
