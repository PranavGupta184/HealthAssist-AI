'use server';

import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import { generateTreatmentOptions } from '@/ai/flows/generate-treatment-options';
import { z } from 'zod';

const symptomSchema = z.object({
  symptoms: z.string().min(10, 'Please provide more details about your symptoms.'),
  medicalHistory: z.string().optional(),
});

const treatmentSchema = z.object({
  diagnosis: z.string(),
  symptoms: z.string(),
  medicalHistory: z.string().optional(),
});

export async function handleAnalyzeSymptoms(data: { symptoms: string; medicalHistory?: string }) {
  const validation = symptomSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors.map((e) => e.message).join(', ') };
  }

  try {
    const result = await analyzeSymptoms(validation.data);
    return result;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return { error: 'Failed to analyze symptoms due to a server error.' };
  }
}

export async function handleGenerateTreatments(data: {
  diagnosis: string;
  symptoms: string;
  medicalHistory?: string;
}) {
  const validation = treatmentSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid input for generating treatments.' };
  }
  
  try {
    const result = await generateTreatmentOptions(validation.data);
    return result;
  } catch (error) {
    console.error('Error generating treatment options:', error);
    return { error: 'Failed to generate treatment options due to a server error.' };
  }
}
