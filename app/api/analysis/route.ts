import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { analysisScenarioSchema } from '@/lib/types/financial';
import { calculateStressedMetrics } from '@/lib/calculations/stress';
import { projectCashflows } from '@/lib/calculations';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const json = await request.json();
    
    // Validate request body
    const scenario = analysisScenarioSchema.parse(json);
    
    // Run analysis
    const cashflows = await projectCashflows(json.instrument, scenario);
    const results = calculateStressedMetrics(cashflows, scenario.assumptions);
    
    // Store results
    const { data, error } = await supabase
      .from('analysis_results')
      .insert([{
        organization_id: json.organizationId,
        analysis_type: 'stress',
        parameters: scenario.assumptions,
        results
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ...data, results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid analysis parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to run analysis' }, { status: 500 });
  }
}