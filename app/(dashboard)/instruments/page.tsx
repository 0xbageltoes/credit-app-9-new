'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { Instrument } from '@/lib/types/financial';

export default function InstrumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: instruments, isLoading } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => {
      const response = await fetch('/api/instruments');
      if (!response.ok) throw new Error('Failed to fetch instruments');
      return response.json() as Promise<Instrument[]>;
    },
  });

  const filteredInstruments = instruments?.filter((instrument) =>
    instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search instruments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Instrument
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Maturity</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstruments?.map((instrument) => (
              <TableRow key={instrument.id}>
                <TableCell className="font-medium">
                  {instrument.name}
                </TableCell>
                <TableCell className="capitalize">
                  {instrument.type}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={instrument.status === 'current' ? 'default' : 'destructive'}
                  >
                    {instrument.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(instrument.currentBalance)}
                </TableCell>
                <TableCell>
                  {instrument.rate.type === 'fixed'
                    ? `${instrument.rate.value}%`
                    : `${instrument.rate.index} + ${instrument.rate.spread}%`}
                </TableCell>
                <TableCell>
                  {format(instrument.dates.maturity, 'PP')}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {/* Assuming created_at is available */}
                  {format(new Date(), 'PP')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}