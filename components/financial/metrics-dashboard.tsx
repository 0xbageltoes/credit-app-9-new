'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { AnalysisResults } from '@/lib/types/financial';

interface MetricsDashboardProps {
  results: AnalysisResults;
}

export function MetricsDashboard({ results }: MetricsDashboardProps) {
  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const cashflowData = results.cashflows.map((cf) => ({
    date: format(cf.date, 'MMM yyyy'),
    principal: cf.principal,
    interest: cf.interest,
    total: cf.netCashFlow,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Yield</p>
          <p className="text-2xl font-semibold">{formatPercent(results.yield)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Duration</p>
          <p className="text-2xl font-semibold">{results.duration.toFixed(2)} years</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">WAL</p>
          <p className="text-2xl font-semibold">{results.wal.toFixed(2)} years</p>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="cashflows">
          <TabsList>
            <TabsTrigger value="cashflows">Cash Flows</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="cashflows" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="principal"
                    stroke="hsl(var(--chart-1))"
                    name="Principal"
                  />
                  <Line
                    type="monotone"
                    dataKey="interest"
                    stroke="hsl(var(--chart-2))"
                    name="Interest"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--chart-3))"
                    name="Total"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Total Principal</p>
                <p className="text-lg">
                  {formatCurrency(results.metrics.totalPrincipal)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Total Interest</p>
                <p className="text-lg">
                  {formatCurrency(results.metrics.totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Total Prepayment</p>
                <p className="text-lg">
                  {formatCurrency(results.metrics.totalPrepayment)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Total Default</p>
                <p className="text-lg">
                  {formatCurrency(results.metrics.totalDefault)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Total Recovery</p>
                <p className="text-lg">
                  {formatCurrency(results.metrics.totalRecovery)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">WAC</p>
                <p className="text-lg">{formatPercent(results.wac)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}