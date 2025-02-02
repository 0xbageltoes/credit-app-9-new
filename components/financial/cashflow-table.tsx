'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, MoreHorizontal } from 'lucide-react';
import { CashFlow } from '@/lib/types/financial';

interface CashflowTableProps {
  cashflows: CashFlow[];
  onExport?: () => void;
}

export function CashflowTable({ cashflows, onExport }: CashflowTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const calculateRunningTotal = (index: number) => {
    return cashflows
      .slice(0, index + 1)
      .reduce((sum, cf) => sum + cf.netCashFlow, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cash Flows</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Show All</DropdownMenuItem>
              <DropdownMenuItem>Show Scheduled Only</DropdownMenuItem>
              <DropdownMenuItem>Show Actual Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Interest</TableHead>
              <TableHead className="text-right">Prepayment</TableHead>
              <TableHead className="text-right">Default</TableHead>
              <TableHead className="text-right">Recovery</TableHead>
              <TableHead className="text-right">Net Cash Flow</TableHead>
              <TableHead className="text-right">Running Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashflows.map((cf, index) => (
              <TableRow key={index}>
                <TableCell>{format(cf.date, 'PP')}</TableCell>
                <TableCell className="capitalize">{cf.type}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(cf.principal)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(cf.interest)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {cf.prepayment ? formatCurrency(cf.prepayment) : '-'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {cf.default ? formatCurrency(cf.default) : '-'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {cf.recovery ? formatCurrency(cf.recovery) : '-'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(cf.netCashFlow)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(calculateRunningTotal(index))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}