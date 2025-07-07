'use server';

/**
 * @fileOverview An AI agent for generating treatment options based on a diagnosis.
 *
 * - generateTreatmentOptions - A function that generates treatment options.
 * - GenerateTreatmentOptionsInput - The input type for the generateTreatmentOptions function.
 * - GenerateTreatmentOptionsOutput - The return type for the generateTreatmentOptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentOptionsInputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis for which to generate treatment options.'),
  symptoms: z.string().describe('The symptoms exhibited by the patient.'),
  medicalHistory: z.string().describe('The relevant medical history of the patient.'),
});
export type GenerateTreatmentOptionsInput = z.infer<typeof GenerateTreatmentOptionsInputSchema>;

const GenerateTreatmentOptionsOutputSchema = z.object({
  treatmentOptions: z.array(
    z.object({
      type: z.string().describe('The type of treatment (e.g., medication, lifestyle adjustment).'),
      description: z.string().describe('A detailed description of the treatment option.'),
    })
  ).describe('A list of possible treatment options.'),
  disclaimer: z.string().describe('A disclaimer that the treatment options are not a substitute for professional medical advice.'),
});
export type GenerateTreatmentOptionsOutput = z.infer<typeof GenerateTreatmentOptionsOutputSchema>;

export async function generateTreatmentOptions(input: GenerateTreatmentOptionsInput): Promise<GenerateTreatmentOptionsOutput> {
  return generateTreatmentOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTreatmentOptionsPrompt',
  input: {schema: GenerateTreatmentOptionsInputSchema},
  output: {schema: GenerateTreatmentOptionsOutputSchema},
  prompt: `You are a medical expert. Given a diagnosis, symptoms and medical history, you will generate a list of possible treatment options, including medications, behavioral interventions, and lifestyle adjustments.

Diagnosis: {{{diagnosis}}}
Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}

Treatment Options:`, // Ensure the AI knows how to format the output.
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateTreatmentOptionsFlow = ai.defineFlow(
  {
    name: 'generateTreatmentOptionsFlow',
    inputSchema: GenerateTreatmentOptionsInputSchema,
    outputSchema: GenerateTreatmentOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
    });

    const disclaimer = "This information is intended for informational purposes only and does not constitute medical advice. It is essential to consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment.";

    return {
      ...output!,
      disclaimer,
    };
  }
);
