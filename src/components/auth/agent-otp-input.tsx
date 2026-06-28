'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { AGENT_OTP_LENGTH } from '@/components/auth/agent-auth-styles';
import { cn } from '@/components/ui/utils';

const OTP_SLOT =
  'h-14 w-full rounded-xl border border-[#e5e7eb] bg-white text-center font-sans text-xl font-bold first:rounded-xl last:rounded-xl data-[active=true]:border-[#4b2e6f] data-[active=true]:text-[#4b2e6f] lg:h-11 lg:rounded-[10px] lg:text-lg lg:first:rounded-[10px] lg:last:rounded-[10px]';

export function AgentOtpInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <InputOTP
      maxLength={AGENT_OTP_LENGTH}
      value={value}
      onChange={onChange}
      containerClassName={cn('grid w-full max-w-md grid-cols-6 gap-2 sm:gap-3', className)}
    >
      <InputOTPGroup className="contents">
        {Array.from({ length: AGENT_OTP_LENGTH }, (_, index) => (
          <InputOTPSlot key={index} index={index} className={OTP_SLOT} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
