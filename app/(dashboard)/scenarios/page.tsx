'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Copy, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { AnalysisScenario } from '@/lib/types/financial';

export default function ScenariosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      const response = await fetch('/api/scenarios');
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      return response.json() as Promise<AnalysisScenario[]>;
    },
  });

  const filteredScenarios = scenarios?.filter((scenario) =>
    scenario.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Base Case</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Standard assumptions with no stress factors
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Stress Test</h3>
          <p className="text-sm text-muted-foreground mb-4">
            High default rates with low recovery
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Rate Shock</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sudden interest rate increases
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Results</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScenarios?.map((scenario) => (
              <TableRow key={scenario.id}>
                <TableCell className="font-medium">
                  {scenario.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {scenario.assumptions.defaultRate ? 'Stress' : 'Base'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(), 'PP')}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {scenario.results
                    ? format(new Date(), 'PP')
                    : 'Never'}
                </TableCell>
                <TableCell>
                  {scenario.results && (
                    <Badge variant="default">
                      Available
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}