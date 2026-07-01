'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function AgentAuthBackArrow({ label = 'Go back' }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label}
      className="mb-2 -ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden />
    </button>
  );
}
