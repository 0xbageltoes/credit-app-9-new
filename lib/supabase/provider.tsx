'use client';

import { createContext, useEffect, useState } from 'react';
import { createClient } from './client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' && window.location.pathname.startsWith('/auth')) {
        window.location.replace('/dashboard');
      } else if (event === 'SIGNED_OUT' && !window.location.pathname.startsWith('/auth')) {
        window.location.replace('/auth/sign-in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  );
}

export { Context };