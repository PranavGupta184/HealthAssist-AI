'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TreatmentOptions } from '@/lib/definitions';
import { AlertCircle, Pill, Activity, Soup } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type TreatmentDisplayProps = {
  treatmentOptions: TreatmentOptions | null;
  isLoading: boolean;
};

const getIconForType = (type: string) => {
  const lowerCaseType = type.toLowerCase();
  if (lowerCaseType.includes('medication')) return <Pill className="h-5 w-5 text-primary" />;
  if (lowerCaseType.includes('lifestyle') || lowerCaseType.includes('adjustment')) return <Soup className="h-5 w-5 text-green-500" />;
  if (lowerCaseType.includes('behavioral') || lowerCaseType.includes('intervention')) return <Activity className="h-5 w-5 text-orange-500" />;
  return <Pill className="h-5 w-5 text-primary" />;
};

export default function TreatmentDisplay({ treatmentOptions, isLoading }: TreatmentDisplayProps) {
    if (isLoading) {
        return <div className="text-center p-8">Loading treatment options...</div>;
    }
    
    if (!treatmentOptions) {
        return null;
    }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {treatmentOptions.treatmentOptions.map((option, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="font-semibold text-left">
              <div className="flex items-center gap-3">
                {getIconForType(option.type)}
                <span>{option.type}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {option.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Alert variant="default" className="mt-6 bg-accent/20 border-accent/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>{treatmentOptions.disclaimer}</AlertDescription>
      </Alert>
    </div>
  );
}
