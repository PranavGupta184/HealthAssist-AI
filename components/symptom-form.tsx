'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardEdit, HeartPulse, Loader2, RefreshCw } from 'lucide-react';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
  medicalHistory: z.string().optional(),
});

type SymptomFormProps = {
  onAnalyze: (symptoms: string, medicalHistory: string) => void;
  isLoading: boolean;
  onReset: () => void;
};

export default function SymptomForm({ onAnalyze, isLoading, onReset }: SymptomFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      medicalHistory: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAnalyze(values.symptoms, values.medicalHistory || '');
  }

  const handleReset = () => {
    form.reset();
    onReset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>
              Provide as much detail as possible for a more accurate analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5" />
                    Current Symptoms
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I have a persistent cough, a slight fever, and a headache..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ClipboardEdit className="h-5 w-5" />
                    Relevant Medical History (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., History of asthma, allergic to penicillin..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
             <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
