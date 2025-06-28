'use server';

/**
 * @fileOverview Generates impactful wording for donation appeals using AI.
 *
 * - generateDonationAppeal - A function that generates donation appeal suggestions.
 * - GenerateDonationAppealInput - The input type for the generateDonationAppeal function.
 * - GenerateDonationAppealOutput - The return type for the generateDonationAppeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDonationAppealInputSchema = z.object({
  category: z
    .string()
    .describe('The category of the donation appeal (e.g., Orphanage, Gowshala, etc.).'),
  priority: z.string().describe('The specific fundraising priority for this category.'),
});
export type GenerateDonationAppealInput = z.infer<typeof GenerateDonationAppealInputSchema>;

const GenerateDonationAppealOutputSchema = z.object({
  appealText: z
    .string()
    .describe('An AI-generated suggestion for impactful wording for the donation appeal.'),
});
export type GenerateDonationAppealOutput = z.infer<typeof GenerateDonationAppealOutputSchema>;

export async function generateDonationAppeal(input: GenerateDonationAppealInput): Promise<GenerateDonationAppealOutput> {
  return generateDonationAppealFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDonationAppealPrompt',
  input: {schema: GenerateDonationAppealInputSchema},
  output: {schema: GenerateDonationAppealOutputSchema},
  prompt: `You are a fundraising expert specializing in crafting compelling donation appeals.

  Given the donation category and the specific fundraising priority, generate a suggestion for impactful wording to communicate the need to potential donors.

  Category: {{{category}}}
  Fundraising Priority: {{{priority}}}

  Appeal Suggestion:`, // Removed Handlebars 'safeString' call.
});

const generateDonationAppealFlow = ai.defineFlow(
  {
    name: 'generateDonationAppealFlow',
    inputSchema: GenerateDonationAppealInputSchema,
    outputSchema: GenerateDonationAppealOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
