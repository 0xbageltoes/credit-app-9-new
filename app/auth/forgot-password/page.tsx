'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabase } from '@/lib/supabase/hooks';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { supabase } = useSupabase();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email);

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast.success('Password reset instructions sent');
    } catch (error) {
      toast.error('Failed to send reset instructions');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-muted-foreground">
          We have sent password reset instructions to your email address.
        </p>
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <Link href="/auth/sign-in">
            Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Forgot your password?</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send reset instructions'}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link
          href="/auth/sign-in"
          className="text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}