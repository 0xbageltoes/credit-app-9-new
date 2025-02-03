import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.error();
  }

  const response = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        request.cookies.set({ name, value: '', ...options });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth routes handling
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isRootRoute = request.nextUrl.pathname === '/';

  // Handle authentication redirects
  if (!isAuthRoute && !session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  } else if (session && (isAuthRoute || isRootRoute)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}