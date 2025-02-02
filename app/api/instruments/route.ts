import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { instrumentSchema } from '@/lib/types/financial';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('instruments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const json = await request.json();
    
    // Validate request body
    const instrument = instrumentSchema.parse(json);
    
    const { data, error } = await supabase
      .from('instruments')
      .insert([instrument])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid instrument data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create instrument' }, { status: 500 });
  }
}