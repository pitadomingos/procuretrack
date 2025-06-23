'use client';

import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getAuth, EmailAuthProvider } from 'firebase/auth';
import { getApp } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [renderAuth, setRenderAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // FirebaseUI uses `window`, so we can't render it on the server
    setRenderAuth(true);
  }, []);

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true, // It's good practice to require a name
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        // The onAuthStateChanged listener in AuthProvider will handle session creation.
        // We just need to redirect to the home page upon success.
        router.push('/');
        return false; // Prevents redirecting to a default FirebaseUI page
      },
    },
  };

  return (
    <div>
      {renderAuth ? (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth(getApp())} />
      ) : null}
    </div>
  );
}
