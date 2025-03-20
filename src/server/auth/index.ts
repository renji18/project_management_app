import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "./config";

// Define a safer type for NextAuth instance
interface NextAuthInstance {
  auth: (request: Request) => Promise<Response | null>;
  handlers: Record<string, (...args: unknown[]) => Promise<unknown>>;
  signIn: (
    provider: string,
    options?: Record<string, unknown>,
  ) => Promise<void>;
  signOut: (options?: Record<string, unknown>) => Promise<void>;
}

// Explicitly cast NextAuth return value
const nextAuthInstance: NextAuthInstance = NextAuth(
  authConfig,
) as NextAuthInstance;

// Use the properly typed values
const auth = cache(nextAuthInstance.auth);
const handlers = nextAuthInstance.handlers;
const signIn = nextAuthInstance.signIn;
const signOut = nextAuthInstance.signOut;

export { auth, handlers, signIn, signOut };
