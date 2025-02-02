'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Instrument } from '@/lib/types/financial';

interface InstrumentDetailsProps {
  instrument: Instrument;
}

export function InstrumentDetails({ instrument }: InstrumentDetailsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{instrument.name}</h2>
          <p className="text-sm text-muted-foreground">
            {instrument.identifier || 'No identifier'}
          </p>
        </div>
        <Badge
          variant={instrument.status === 'current' ? 'default' : 'destructive'}
        >
          {instrument.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium mb-1">Type</p>
          <p className="text-sm">{instrument.type}</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Original Balance</p>
          <p className="text-sm">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(instrument.originalBalance)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Current Balance</p>
          <p className="text-sm">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(instrument.currentBalance)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Rate</p>
          <p className="text-sm">
            {instrument.rate.type === 'floating' ? (
              <>
                {instrument.rate.index} + {instrument.rate.spread}%
                {instrument.rate.floor && ` (Floor: ${instrument.rate.floor}%)`}
                {instrument.rate.cap && ` (Cap: ${instrument.rate.cap}%)`}
              </>
            ) : (
              `${instrument.rate.value}%`
            )}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Issue Date</p>
          <p className="text-sm">
            {instrument.dates.issue
              ? format(instrument.dates.issue, 'PP')
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Effective Date</p>
          <p className="text-sm">
            {format(instrument.dates.effective, 'PP')}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Maturity Date</p>
          <p className="text-sm">
            {format(instrument.dates.maturity, 'PP')}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Next Payment</p>
          <p className="text-sm">
            {format(instrument.dates.nextPayment, 'PP')}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Payment Frequency</p>
          <p className="text-sm">{instrument.dates.paymentFrequency}</p>
        </div>
      </div>
    </Card>
  );
}