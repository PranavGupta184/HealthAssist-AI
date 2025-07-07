'use client';

import { useState } from 'react';
import { AlertCircle, Bot, CheckCircle, Loader2 } from 'lucide-react';
import { handleAnalyzeSymptoms, handleGenerateTreatments } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Diagnosis, TreatmentOptions } from '@/lib/definitions';
import SymptomForm from '@/components/symptom-form';
import DiagnosisList from '@/components/diagnosis-list';
import Header from '@/components/header';

export default function Home() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
  const [treatmentOptions, setTreatmentOptions] = useState<TreatmentOptions | null>(null);
  const [currentSymptoms, setCurrentSymptoms] = useState('');
  const [currentMedicalHistory, setCurrentMedicalHistory] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAnalyzeSymptoms = async (symptoms: string, medicalHistory: string) => {
    setIsLoadingAnalysis(true);
    setError(null);
    setDiagnoses(null);
    setTreatmentOptions(null);
    setCurrentSymptoms(symptoms);
    setCurrentMedicalHistory(medicalHistory);

    try {
      const result = await handleAnalyzeSymptoms({ symptoms, medicalHistory });
      if (result.error) {
        setError(result.error);
      } else {
        setDiagnoses(result.diagnoses ?? []);
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const onGetTreatmentOptions = async (diagnosis: string) => {
    setIsLoadingTreatments(true);
    setError(null);
    setTreatmentOptions(null);
    try {
      const result = await handleGenerateTreatments({
        diagnosis,
        symptoms: currentSymptoms,
        medicalHistory: currentMedicalHistory,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setTreatmentOptions(result);
      }
    } catch (e) {
      setError('An unexpected error occurred while fetching treatment options.');
    } finally {
      setIsLoadingTreatments(false);
    }
  };
  
  const resetState = () => {
    setDiagnoses(null);
    setTreatmentOptions(null);
    setError(null);
    setCurrentSymptoms('');
    setCurrentMedicalHistory('');
    setIsLoadingAnalysis(false);
    setIsLoadingTreatments(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Symptom Checker</h2>
            <SymptomForm
              onAnalyze={onAnalyzeSymptoms}
              isLoading={isLoadingAnalysis}
              onReset={resetState}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">AI Analysis</h2>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoadingAnalysis && (
              <div className="flex items-center justify-center rounded-lg border p-12 bg-card">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">Analyzing your symptoms...</p>
                  <p className="text-sm text-muted-foreground">Please wait while our AI processes your information.</p>
                </div>
              </div>
            )}
            
            {!isLoadingAnalysis && !diagnoses && !error && (
               <div className="flex items-center justify-center rounded-lg border p-12 bg-card">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Bot className="h-12 w-12 text-primary" />
                  <p className="text-lg font-medium">Ready to assist</p>
                  <p className="text-sm text-muted-foreground">Enter your symptoms and medical history to get started.</p>
                </div>
              </div>
            )}

            {diagnoses && (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Analysis Complete!</AlertTitle>
                  <AlertDescription>
                    Here are the potential diagnoses based on your symptoms.
                  </AlertDescription>
                </Alert>
                <DiagnosisList
                  diagnoses={diagnoses}
                  onGetTreatmentOptions={onGetTreatmentOptions}
                  isLoadingTreatments={isLoadingTreatments}
                  treatmentOptions={treatmentOptions}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
