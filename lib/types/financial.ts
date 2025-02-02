import { z } from 'zod';

// Enums as const objects for better type safety
export const InstrumentType = {
  LOAN: 'loan',
  SECURITY: 'security',
  FACILITY: 'facility',
  POOL: 'pool',
} as const;

export const RateType = {
  FIXED: 'fixed',
  FLOATING: 'floating',
} as const;

export const PaymentFrequency = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'semi-annual',
  ANNUAL: 'annual',
} as const;

export const InstrumentStatus = {
  CURRENT: 'current',
  DEFAULTED: 'defaulted',
  PAID: 'paid',
  MODIFIED: 'modified',
} as const;

// Zod schemas for runtime validation
export const rateSchema = z.object({
  type: z.enum([RateType.FIXED, RateType.FLOATING]),
  value: z.number(),
  index: z.string().optional(),
  spread: z.number().optional(),
  floor: z.number().optional(),
  cap: z.number().optional(),
});

export const instrumentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    InstrumentType.LOAN,
    InstrumentType.SECURITY,
    InstrumentType.FACILITY,
    InstrumentType.POOL,
  ]),
  name: z.string(),
  identifier: z.string().optional(),
  originalBalance: z.number().positive(),
  currentBalance: z.number().min(0),
  rate: rateSchema,
  dates: z.object({
    issue: z.date().optional(),
    effective: z.date(),
    maturity: z.date(),
    paymentFrequency: z.enum([
      PaymentFrequency.MONTHLY,
      PaymentFrequency.QUARTERLY,
      PaymentFrequency.SEMI_ANNUAL,
      PaymentFrequency.ANNUAL,
    ]),
    nextPayment: z.date(),
  }),
  status: z.enum([
    InstrumentStatus.CURRENT,
    InstrumentStatus.DEFAULTED,
    InstrumentStatus.PAID,
    InstrumentStatus.MODIFIED,
  ]),
  metadata: z.record(z.unknown()),
});

export const cashFlowSchema = z.object({
  date: z.date(),
  type: z.enum(['scheduled', 'actual', 'projected']),
  principal: z.number(),
  interest: z.number(),
  fees: z.number().optional(),
  prepayment: z.number().optional(),
  default: z.number().optional(),
  recovery: z.number().optional(),
  netCashFlow: z.number(),
});

export const analysisScenarioSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  assumptions: z.object({
    prepaymentRate: z.number().min(0).max(100).optional(),
    defaultRate: z.number().min(0).max(100).optional(),
    recoveryRate: z.number().min(0).max(100).optional(),
    ratePath: z
      .array(
        z.object({
          date: z.date(),
          rate: z.number(),
        })
      )
      .optional(),
    timing: z.record(z.unknown()).optional(),
  }),
  results: z
    .object({
      yield: z.number(),
      duration: z.number(),
      wac: z.number(),
      wal: z.number(),
      irr: z.number(),
      cashflows: z.array(cashFlowSchema),
      metrics: z.record(z.number()),
    })
    .optional(),
});

// TypeScript types inferred from Zod schemas
export type Rate = z.infer<typeof rateSchema>;
export type Instrument = z.infer<typeof instrumentSchema>;
export type CashFlow = z.infer<typeof cashFlowSchema>;
export type AnalysisScenario = z.infer<typeof analysisScenarioSchema>;
export type AnalysisResults = NonNullable<AnalysisScenario['results']>;