'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { OrganizationSwitcher } from './organization-switcher';
import { GlobalSearch } from './global-search';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <OrganizationSwitcher />
        <GlobalSearch />
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}