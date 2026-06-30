'use client';

import { useEffect } from 'react';

// Global error boundary: catches errors thrown in the root layout itself.
// It replaces the root layout, so it must render its own <html>/<body> and
// cannot rely on global CSS — all styles are inline.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FEFAF4',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '4rem 1.5rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '28rem',
            borderRadius: '1.5rem',
            border: '1px solid #F0EDE6',
            backgroundColor: '#FFFDF9',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1F2A24', margin: 0 }}>
            Something went wrong
          </h1>
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: '#3F4A44',
            }}
          >
            We hit an unexpected problem. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '9999px',
              backgroundColor: '#E88A5F',
              color: '#ffffff',
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9aa39d' }}>
              Reference code: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
