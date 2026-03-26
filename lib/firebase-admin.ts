import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required Firebase admin env var: ${name}`);
  }
  return value;
}

function getAdminApp() {
  return getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: requiredEnv("FIREBASE_PROJECT_ID"),
          clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
          privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        }),
      });
}

export function getAdminDb() {
  const app = getAdminApp();
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = getAdminApp();
  return getAuth(app);
}
