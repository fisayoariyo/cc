import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FEFAF4] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#F0EDE6] bg-[#FFFDF9] p-8 text-center shadow-sm sm:p-10">
        <p className="text-5xl font-semibold tracking-tight text-[#E88A5F]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-[#1F2A24]">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#3F4A44]">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#E88A5F] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-[#F0EDE6] bg-white px-6 py-2.5 text-sm font-semibold text-[#1F2A24] transition-colors hover:bg-[#FEFAF4]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
