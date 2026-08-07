import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const firebaseEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

export const validateFirebaseEnv = (env: Record<string, string | undefined>) => {
  const missing = firebaseEnvKeys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase build config: ${missing.join(", ")}`);
  }
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  validateFirebaseEnv(env);

  return {
    plugins: [react()],
  };
});
