'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  pathname: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Instruments',
    href: '/instruments',
    icon: Database,
    items: [
      { title: 'Overview', href: '/instruments' },
      { title: 'Analysis', href: '/instruments/analysis' },
      { title: 'New', href: '/instruments/new' },
    ],
  },
  {
    name: 'Portfolios',
    href: '/portfolios',
    icon: Briefcase,
    items: [
      { title: 'Overview', href: '/portfolios' },
      { title: 'Analysis', href: '/portfolios/analysis' },
      { title: 'New', href: '/portfolios/new' },
    ],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: LineChart,
  },
  {
    name: 'Portfolios',
    href: '/dashboard/portfolios',
    icon: Briefcase,
  },
  {
    name: 'Market Data',
    href: '/dashboard/market-data',
    icon: Database,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar({ isOpen, pathname }: SidebarProps) {
  return (
    <aside
      className={cn(
        'border-r bg-background transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <nav className="flex flex-col h-full">
        <div className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}