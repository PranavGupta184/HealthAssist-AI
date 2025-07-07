import { z } from 'zod';

const DiagnosisSchema = z.object({
  condition: z.string(),
  confidence: z.number(),
  rationale: z.string(),
  resourceLinks: z.array(z.string()),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

const TreatmentOptionSchema = z.object({
  type: z.string(),
  description: z.string(),
});

const TreatmentOptionsSchema = z.object({
  treatmentOptions: z.array(TreatmentOptionSchema),
  disclaimer: z.string(),
});

export type TreatmentOptions = z.infer<typeof TreatmentOptionsSchema>;
