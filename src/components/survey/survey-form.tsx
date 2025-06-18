
'use client';

import { useState } from 'react'; // Added missing import
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import type { SurveyFormValues } from '@/types';

const surveySchema = z.object({
  easeOfUse: z.string().min(1, { message: 'Please select a rating for ease of use.' }),
  featureSatisfaction: z.string().min(1, { message: 'Please select a rating for feature satisfaction.' }),
  responsiveness: z.string().min(1, { message: 'Please select an option for responsiveness.' }),
  recommendationLikelihood: z.string().min(1, { message: 'Please select how likely you are to recommend.' }),
  mostUsedFeatures: z.string().min(5, {message: 'Please list some features you use.'}).max(500, {message: 'Response too long.'}),
  suggestions: z.string().max(1000, {message: 'Suggestion too long.'}).optional(),
});

const ratingOptions = [
  { value: '1', label: '1 (Very Dissatisfied/Difficult/Unlikely)' },
  { value: '2', label: '2' },
  { value: '3', label: '3 (Neutral)' },
  { value: '4', label: '4' },
  { value: '5', label: '5 (Very Satisfied/Easy/Likely)' },
];

const responsivenessOptions = [
  { value: 'yes', label: 'Yes, it\'s fast and responsive.' },
  { value: 'somewhat', label: 'Somewhat, it could be faster.' },
  { value: 'no', label: 'No, it often feels slow.' },
];

export function SurveyForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      easeOfUse: '',
      featureSatisfaction: '',
      responsiveness: '',
      recommendationLikelihood: '',
      mostUsedFeatures: '',
      suggestions: '',
    },
  });

  const onSubmit = (data: SurveyFormValues) => {
    setIsSubmitting(true);
    console.log('Survey Data Submitted:', data);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Survey Submitted!',
        description: 'Thank you for your valuable feedback.',
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="easeOfUse"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">1. How would you rate the overall ease of use of this application?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {ratingOptions.map(option => (
                    <FormItem key={`ease-${option.value}`} className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value={option.value} /></FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featureSatisfaction"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">2. How satisfied are you with the features currently available?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {ratingOptions.map(option => (
                    <FormItem key={`featuresat-${option.value}`} className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value={option.value} /></FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsiveness"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">3. Do you find the application responsive and fast?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {responsivenessOptions.map(option => (
                    <FormItem key={`resp-${option.value}`} className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value={option.value} /></FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="recommendationLikelihood"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">4. How likely are you to recommend this procurement system to others?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {ratingOptions.map(option => (
                    <FormItem key={`reco-${option.value}`} className="flex items-center space-x-3 space-y-0">
                      <FormControl><RadioGroupItem value={option.value} /></FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mostUsedFeatures"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">5. What features or parts of the application do you use most often?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Creating Purchase Orders, Viewing Analytics, Managing Suppliers..."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suggestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">6. Do you have any suggestions for improvement or features you feel are missing?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your suggestions are welcome..."
                  className="resize-y min-h-[120px]"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                This could include new functionalities, UI enhancements, or any other ideas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
