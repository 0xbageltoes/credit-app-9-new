'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const analysisFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  prepaymentRate: z.number().min(0).max(100).optional(),
  defaultRate: z.number().min(0).max(100).optional(),
  recoveryRate: z.number().min(0).max(100).optional(),
  useCustomRates: z.boolean().default(false),
  ratePath: z
    .array(
      z.object({
        date: z.string(),
        rate: z.number().min(0).max(100),
      })
    )
    .optional(),
});

type AnalysisFormValues = z.infer<typeof analysisFormSchema>;

interface AnalysisFormProps {
  onSubmit: (values: AnalysisFormValues) => void;
  isLoading?: boolean;
}

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [activeTab, setActiveTab] = useState('assumptions');

  const form = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      name: '',
      prepaymentRate: 0,
      defaultRate: 0,
      recoveryRate: 40,
      useCustomRates: false,
      ratePath: [],
    },
  });

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          <TabsTrigger value="rates">Rate Path</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="assumptions">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scenario Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prepaymentRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prepayment Rate (%)</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={0.1}
                          value={[field.value || 0]}
                          onValueChange={([value]) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Annual constant prepayment rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Rate (%)</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={0.1}
                          value={[field.value || 0]}
                          onValueChange={([value]) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Annual constant default rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recoveryRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recovery Rate (%)</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={0.1}
                          value={[field.value || 0]}
                          onValueChange={([value]) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Expected recovery rate on defaults
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="rates">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="useCustomRates"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Use Custom Rate Path</FormLabel>
                        <FormDescription>
                          Define a custom interest rate path over time
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('useCustomRates') && (
                  <div className="space-y-2">
                    {/* Rate path inputs would go here */}
                    <p className="text-sm text-muted-foreground">
                      Rate path configuration coming soon
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="timing">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Timing assumptions configuration coming soon
                </p>
              </div>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Running Analysis...' : 'Run Analysis'}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
}