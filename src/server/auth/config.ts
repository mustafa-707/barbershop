import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import bcrypt from "bcryptjs";

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
      role: 'USER' | 'ADMIN';
      phone: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: 'USER' | 'ADMIN';
    phone: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "BarberShop Login",
      credentials: {
        phone: { label: "Phone & Country Code", type: "text" },
        name: { label: "Name", type: "text" },
        password: { label: "Password (Admin only)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;
        
        const identifier = credentials.phone as string;
        const name = (credentials.name as string) || "Anonymous";
        const password = credentials.password as string | undefined;
        const ADMIN_SECRET = process.env.ADMIN_PASSWORD ?? "admin123";

        // Support both phone and email login
        const isEmailLogin = identifier.includes("@");
        
        let user = await db.query.users.findFirst({
          where: isEmailLogin 
            ? eq(users.email, identifier)
            : eq(users.phone, identifier)
        });

        let isValidPassword = false;
        if (password && user?.hashedPassword) {
            isValidPassword = bcrypt.compareSync(password, user.hashedPassword);
        }

        const isSettingAdmin = !!password && password === ADMIN_SECRET;

        // If user is ADMIN, they must provide a valid password or the admin secret
        if (user?.role === "ADMIN" && !isSettingAdmin && !isValidPassword) {
          throw new Error("Invalid admin password");
        }

        if (!user) {
          // Only create new users for phone-based registration (not email)
          if (isEmailLogin) {
            throw new Error("No account found with this email");
          }
          const newUsers = await db.insert(users).values({
            phone: identifier,
            name,
            role: isSettingAdmin ? "ADMIN" : "USER"
          }).returning();
          user = newUsers[0];
        } else if (isSettingAdmin && user.role !== "ADMIN") {
          const updated = await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, user.id)).returning();
          user = updated[0];
        }

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        role: token.role as 'USER' | 'ADMIN',
        phone: token.phone as string | null,
      },
    }),
  },
} satisfies NextAuthConfig;
