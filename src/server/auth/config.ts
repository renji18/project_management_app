import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/utils/zod";
import { ZodError } from "zod";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: NextAuthOptions = {
  // debug: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = (await prisma.user.findUnique({
            where: { email },
            include: { auth: true },
          })) as {
            id: string;
            name: string;
            email: string;
            auth: { password: string } | null;
          } | null;

          if (!user?.auth?.password) throw new Error("User not found");

          const authenticated = await bcrypt.compare(
            password,
            user.auth.password,
          );

          if (!authenticated) throw new Error("Invalid Credentials");

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Invalid Credentials format.");
          }
          throw new Error(String(error));
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
