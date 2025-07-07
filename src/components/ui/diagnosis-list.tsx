'use client';

import { useState } from 'react';
import { AlertCircle, BookOpen, Lightbulb, Loader2 } from 'lucide-react';
import { Diagnosis, TreatmentOptions } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TreatmentDisplay from './treatment-display';

type DiagnosisListProps = {
  diagnoses: Diagnosis[];
  onGetTreatmentOptions: (diagnosis: string) => void;
  isLoadingTreatments: boolean;
  treatmentOptions: TreatmentOptions | null;
};

export default function DiagnosisList({
  diagnoses,
  onGetTreatmentOptions,
  isLoadingTreatments,
  treatmentOptions,
}: DiagnosisListProps) {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);

  const handleGetTreatments = (condition: string) => {
    setSelectedDiagnosis(condition);
    onGetTreatmentOptions(condition);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return 'bg-green-500';
    if (confidence > 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-accent text-accent-foreground border-accent">
        <AlertCircle className="h-4 w-4 text-accent-foreground" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This is not a medical diagnosis. Consult a healthcare professional for accurate advice.
        </AlertDescription>
      </Alert>

      {diagnoses.map((diagnosis, index) => (
        <Dialog key={index} onOpenChange={(open) => !open && setSelectedDiagnosis(null)}>
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-primary" /> {diagnosis.condition}
                  </CardTitle>
                  <CardDescription>Potential Diagnosis</CardDescription>
                </div>
                <Badge variant="secondary">#{index + 1}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Confidence Score: {Math.round(diagnosis.confidence * 100)}%</p>
                <Progress value={diagnosis.confidence * 100} className="h-2 [&>div]:" indicatorClassName={getConfidenceColor(diagnosis.confidence)} />
              </div>
              <div>
                <p className="text-sm font-medium">Rationale</p>
                <p className="text-sm text-muted-foreground">{diagnosis.rationale}</p>
              </div>
              {diagnosis.resourceLinks && diagnosis.resourceLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4"/>Further Reading</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {diagnosis.resourceLinks.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          Learn more about {diagnosis.condition}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <DialogTrigger asChild>
                <Button onClick={() => handleGetTreatments(diagnosis.condition)} className="w-full">
                  {isLoadingTreatments && selectedDiagnosis === diagnosis.condition ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Treatments...
                    </>
                  ) : `View Treatment Options for ${diagnosis.condition}`}
                </Button>
              </DialogTrigger>
            </CardFooter>
          </Card>

          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Treatment Options for {diagnosis.condition}</DialogTitle>
              <DialogDescription>
                These are AI-generated suggestions. Always consult with a healthcare provider.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
                <TreatmentDisplay 
                  treatmentOptions={treatmentOptions}
                  isLoading={isLoadingTreatments && selectedDiagnosis === diagnosis.condition}
                />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
