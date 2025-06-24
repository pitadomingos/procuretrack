'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CustomLoginForm } from '@/components/auth/custom-login-form';
import { Flame } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Flame className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">
            Welcome to ProcureTrack
          </CardTitle>
          <CardDescription>
            Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomLoginForm />
        </CardContent>
        <CardFooter>
            <p className="text-xs text-center text-muted-foreground w-full">
                For demo, any non-empty password will work with a valid user email.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
