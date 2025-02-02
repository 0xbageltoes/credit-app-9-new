import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cashFlowSchema } from '@/lib/types/financial';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instrumentId = searchParams.get('instrumentId');

    if (!instrumentId) {
      return NextResponse.json({ error: 'Instrument ID is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cash_flows')
      .select('*')
      .eq('instrument_id', instrumentId)
      .order('flow_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cash flows' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const json = await request.json();
    
    // Validate request body
    const cashFlow = cashFlowSchema.parse(json);
    
    const { data, error } = await supabase
      .from('cash_flows')
      .insert([cashFlow])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid cash flow data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create cash flow' }, { status: 500 });
  }
}