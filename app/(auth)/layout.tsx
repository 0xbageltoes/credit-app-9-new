'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/client';
import { ChartLine } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

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