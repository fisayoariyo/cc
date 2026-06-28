'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';
import { AGENT_SETTINGS_PRIMARY_BTN } from '@/lib/agent-settings-theme';
import { AgentSettingsPanel } from '@/components/agent/agent-settings-panel';
import {
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FIELD_ERROR,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
} from '@/components/auth/agent-auth-styles';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/components/ui/utils';

export function AgentSettingsResetPasswordNewForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setSessionError('Your verification expired. Request a new code and try again.');
      }
      setReady(true);
    });
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMismatch(false);
    setFeedback(null);

    if (password.length < 6) {
      setFeedback('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setMismatch(true);
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      setFeedback(humanizeAuthError(error.message));
      return;
    }

    router.push('/agent/settings?password=updated');
    router.refresh();
  }

  return (
    <AgentSettingsPanel
      title="Reset password"
      backHref="/agent/settings/reset-password"
      footer={
        <button
          type="submit"
          form="agent-reset-password-new"
          disabled={!ready || pending}
          className={AGENT_SETTINGS_PRIMARY_BTN}
        >
          {pending ? 'Updating...' : 'Continue'}
        </button>
      }
    >
      <form id="agent-reset-password-new" onSubmit={(event) => void onSubmit(event)} className={AGENT_FORM_STACK}>
        {sessionError ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {sessionError}
          </p>
        ) : null}
        {feedback ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {feedback}
          </p>
        ) : null}

        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="password" className={AGENT_LABEL_CLASS}>
            Create your password
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Write your password here"
              className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10')}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="confirm-password" className={AGENT_LABEL_CLASS}>
            Confirm password
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setMismatch(false);
              }}
              placeholder="Confirm your password"
              className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10', mismatch && 'border-red-400')}
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              onClick={() => setShowConfirmPassword((value) => !value)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mismatch ? (
            <p className={AGENT_FIELD_ERROR} role="alert">
              Password doesn&apos;t match
            </p>
          ) : null}
        </div>
      </form>
    </AgentSettingsPanel>
  );
}
