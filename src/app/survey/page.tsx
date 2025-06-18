
'use client';

import { SurveyForm } from '@/components/survey/survey-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageCircleQuestion } from 'lucide-react'; // Corrected Icon

export default function SurveyPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageCircleQuestion className="h-8 w-8 text-primary" /> {/* Corrected Icon Usage */}
            <div>
              <CardTitle className="font-headline text-2xl">Application Feedback Survey</CardTitle>
              <CardDescription>
                Your feedback is valuable to us! Please take a few moments to answer these questions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SurveyForm />
        </CardContent>
      </Card>
       <p className="text-sm text-center text-muted-foreground">
        Note: Survey pop-up logic will be implemented based on specific trigger conditions in a future update.
      </p>
    </div>
  );
}

