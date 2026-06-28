'use client';

export default function AgentSettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-4 p-6">
      <h2 className="font-sans text-xl font-bold text-[#1F2A24]">Settings unavailable</h2>
      <p className="text-sm text-[#6b7280]">
        {error.message || 'Something went wrong loading settings.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-[#4b2e6f] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
