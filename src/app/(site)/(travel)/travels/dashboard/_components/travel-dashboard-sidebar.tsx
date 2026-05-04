'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, CircleHelp, FileText, LayoutDashboard, UserCircle } from 'lucide-react';
import Image from 'next/image';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { SidebarAccountMenu } from '@/components/dashboard/SidebarAccountMenu';

const ITEMS = [
  { href: '/travel/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/travel/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/travel/dashboard/updates', label: 'Updates', icon: Bell },
  { href: '/travel/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/travel/dashboard/help', label: 'Help & support', icon: CircleHelp },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/travel/dashboard') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function TravelDashboardSidebar({ fullName }: { fullName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="h-full rounded-2xl bg-white px-4 py-5">
      <div className="mb-8 px-2">
          <Image src={logoLockupColor} alt="Charis Consult" className="h-11 w-auto object-contain" priority />
      </div>

      <nav className="space-y-2">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-[46px] items-center gap-2 rounded-[10px] px-3 py-2 text-[15px] transition-colors ${
                active
                  ? 'bg-[#4b2e6f] text-white shadow-[0_10px_22px_rgba(75,46,111,0.24)]'
                  : 'text-muted-foreground hover:bg-[#f4f1f7] hover:text-foreground'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <SidebarAccountMenu fullName={fullName} fallbackLabel="Travel Client" />
    </aside>
  );
}
