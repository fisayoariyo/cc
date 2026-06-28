import { cn } from '@/components/ui/utils';

function initialsFromName(name?: string | null) {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function ProfileAvatar({
  photoUrl,
  name,
  className,
  fallbackClassName,
}: {
  photoUrl?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
}) {
  const initials = initialsFromName(name);

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name ? `${name} profile photo` : 'Profile photo'}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[#efe8f7] font-sans text-sm font-semibold text-[#3B0063]',
        className,
        fallbackClassName,
      )}
      aria-hidden={!name}
    >
      {initials}
    </div>
  );
}
