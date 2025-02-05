'use client';

import { createContext, useEffect, useState, useCallback } from 'react';
import { createClient } from './client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { useRouter } from 'next/navigation';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
  user: any;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, [supabase.auth]);

  useEffect(() => {
    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        router.refresh();
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        router.refresh();
        router.push('/auth/sign-in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, refreshSession]);

  return (
    <Context.Provider value={{ supabase, user }}>
      {children}
    </Context.Provider>
  );
}

export { Context };