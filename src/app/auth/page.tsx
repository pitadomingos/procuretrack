
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle className="mt-4 font-headline text-2xl">
            Login Disabled
          </CardTitle>
          <CardDescription>
            The login functionality is currently disabled for development.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-center text-muted-foreground">
            You can proceed directly to the application dashboard.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
