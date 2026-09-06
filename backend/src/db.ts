import { Firestore } from '@google-cloud/firestore';

// Initialize Firestore.
// When running on Google Cloud (like Cloud Run), it automatically uses the
// default service account attached to the instance. No keys required.
// For local development, it will look for Application Default Credentials
// (via `gcloud auth application-default login`).
export const db = new Firestore();

// Define a helper to access our specific collections with type safety
export const collections = {
  items: db.collection('items'),
};
