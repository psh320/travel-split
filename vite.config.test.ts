import { describe, expect, it } from "vitest";
import { validateFirebaseEnv } from "./vite.config";

describe("validateFirebaseEnv", () => {
  it("rejects a build with missing Firebase configuration", () => {
    expect(() => validateFirebaseEnv({})).toThrow(
      "Missing Firebase build config: VITE_FIREBASE_API_KEY"
    );
  });

  it("accepts a complete Firebase configuration", () => {
    expect(() =>
      validateFirebaseEnv({
        VITE_FIREBASE_API_KEY: "api-key",
        VITE_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
        VITE_FIREBASE_PROJECT_ID: "example-project",
        VITE_FIREBASE_STORAGE_BUCKET: "example.appspot.com",
        VITE_FIREBASE_MESSAGING_SENDER_ID: "sender-id",
        VITE_FIREBASE_APP_ID: "app-id",
      })
    ).not.toThrow();
  });
});
