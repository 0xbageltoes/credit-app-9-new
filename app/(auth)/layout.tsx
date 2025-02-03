'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/hooks';
import { ChartLine } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard');
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-[400px] mx-auto p-6">
        <div className="flex flex-col items-center mb-8">
          <ChartLine className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-semibold text-foreground">
            Financial Analytics Platform
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}