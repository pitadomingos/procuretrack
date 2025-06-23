// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK.

import { initializeApp, getApp, getApps, type App, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Important for Vercel/env variables
};

function getAdminApp(): App {
  // Check if the default app is already initialized
  if (getApps().some(app => app.name === '[DEFAULT]')) {
    return getApp();
  }

  // Check for credentials before initializing to provide a clearer error
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error('Firebase Admin credentials are not set in the environment. Please check your .env.local file.');
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

// Directly export functions that return the initialized services
export const getAuth = () => getAdminAuth(getAdminApp());
export const getFirestore = () => getAdminFirestore(getAdminApp());
