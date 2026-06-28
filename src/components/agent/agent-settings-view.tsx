'use client';

import { Camera, CircleHelp, Headset, LockKeyhole, Mail, MapPin, Smartphone } from 'lucide-react';
import { AgentSettingsMenuLink } from '@/components/agent/agent-settings-menu-link';
import {
  AgentSettingsMenuCard,
  AgentSettingsPanel,
} from '@/components/agent/agent-settings-panel';
import { ProfileAvatar } from '@/components/dashboard/profile-avatar';

export type AgentSettingsProfile = {
  fullName: string;
  email: string;
  phone: string | null;
  location: string | null;
  photoUrl: string | null;
};

export function AgentSettingsView({
  profile,
  passwordUpdated,
}: {
  profile: AgentSettingsProfile;
  passwordUpdated: boolean;
}) {
  return (
    <AgentSettingsPanel
      title="Settings"
      subtitle="To update your details, contact your administrator"
    >
      {passwordUpdated ? (
        <p className="mb-6 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm font-medium text-[#15803d]">
          Your password was updated successfully.
        </p>
      ) : null}

      <div className="flex flex-row items-start gap-4 pb-8">
        <div className="relative shrink-0">
          <ProfileAvatar
            photoUrl={profile.photoUrl}
            name={profile.fullName}
            className="h-[88px] w-[88px] rounded-2xl object-cover text-xl lg:h-28 lg:w-28 lg:text-2xl"
          />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#F0EDE6] bg-white text-[#4b2e6f] shadow-sm">
            <Camera className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-3 pt-1">
          <p className="font-sans text-lg font-bold leading-snug text-[#1F2A24] lg:text-xl">
            {profile.fullName}
          </p>
          <p className="flex items-start gap-2 font-sans text-sm text-[#1F2A24]">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#4b2e6f]" />
            <span className="break-all">{profile.email}</span>
          </p>
          <p className="flex items-center gap-2 font-sans text-sm text-[#1F2A24]">
            <Smartphone className="h-4 w-4 shrink-0 text-[#4b2e6f]" />
            <span>{profile.phone ?? '—'}</span>
          </p>
          {profile.location ? (
            <p className="flex items-start gap-2 font-sans text-sm capitalize text-[#1F2A24]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4b2e6f]" />
              <span>{profile.location}</span>
            </p>
          ) : null}
        </div>
      </div>

      <AgentSettingsMenuCard>
        <div className="divide-y divide-[#F0EDE6]">
          <AgentSettingsMenuLink
            href="/agent/settings/reset-password"
            icon={LockKeyhole}
            label="Change password"
          />
          <AgentSettingsMenuLink href="/agent/settings/faqs" icon={CircleHelp} label="FAQs" />
          <AgentSettingsMenuLink href="/agent/help" icon={Headset} label="Help desk & Support" />
        </div>
      </AgentSettingsMenuCard>
    </AgentSettingsPanel>
  );
}
