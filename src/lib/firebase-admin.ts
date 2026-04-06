import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({ projectId: "pj-yotsuba-corporate" });
}

const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
