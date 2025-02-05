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
      if (session?.user) {
        router.replace('/dashboard');
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="bg-background rounded-lg border shadow-sm p-8">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ChartLine className="h-6 w-6 text-primary"/>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Financial Analytics Platform
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}