import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { z } from "zod";
import { loginClient } from "@/src/services/loginService";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const loginResult = await loginClient(parsedCredentials.data);
        if (!loginResult.success) {
          return null;
        }

        return {
          id: String(loginResult.data.client.id),
          name: loginResult.data.client.name,
          email: loginResult.data.client.email,
          accessToken: loginResult.data.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;

      if (session.user) {
        session.user.id = token.sub ?? "";
      }

      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = Boolean(session?.user);
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/menu") || nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname.startsWith("/login");

      if (isProtectedRoute) {
        return isLoggedIn;
      }

      if (isLoginRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/menu", nextUrl));
      }

      return true;
    },
  },
});
