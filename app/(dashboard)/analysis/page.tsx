'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnalysisForm } from '@/components/financial/analysis-form';
import { MetricsDashboard } from '@/components/financial/metrics-dashboard';
import { InstrumentDetails } from '@/components/financial/instrument-details';
import { CashflowTable } from '@/components/financial/cashflow-table';
import { toast } from 'sonner';
import type { AnalysisScenario, Instrument } from '@/lib/types/financial';

export default function AnalysisPage() {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisScenario['results'] | null>(null);

  const { data: instruments, isLoading } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => {
      const response = await fetch('/api/instruments');
      if (!response.ok) throw new Error('Failed to fetch instruments');
      return response.json();
    },
  });

  async function runAnalysis(values: AnalysisScenario) {
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          instrument: selectedInstrument,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysisResults(data.results);
      toast.success('Analysis completed successfully');
    } catch (error) {
      toast.error('Failed to run analysis');
      console.error(error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Instrument Selection</h2>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search instruments..."
              onChange={(e) => {
                // Filter instruments
              }}
              className="w-full"
            />
            <div className="grid gap-2">
              {instruments?.map((instrument) => (
                <Button
                  key={instrument.id}
                  variant={selectedInstrument?.id === instrument.id ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => setSelectedInstrument(instrument)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{instrument.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(instrument.currentBalance)}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {selectedInstrument && (
          <InstrumentDetails instrument={selectedInstrument} />
        )}
      </div>

      <AnalysisForm onSubmit={runAnalysis} />

      {analysisResults && (
        <>
          <MetricsDashboard results={analysisResults} />
          <CashflowTable
            cashflows={analysisResults.cashflows}
            onExport={() => {
              // Export functionality
            }}
          />
        </>
      )}
    </div>
  );
}