import { loginClient } from "@/src/services/loginService";
import { refreshSessionTokens } from "@/src/services/refreshSessionService";
import {
  applyAccessTokenToJwt,
  clearAccessTokenFromJwt,
  shouldRefreshAccessToken,
} from "@/src/utils/jwtPayload";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.email("Invalid email"),
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
          refreshToken: loginResult.data.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (typeof user.accessToken === "string") {
          applyAccessTokenToJwt(token, user.accessToken);
        }
        token.refreshToken = user.refreshToken;
        token.error = undefined;
        return token;
      }

      if (token.error === "RefreshAccessTokenError") {
        return token;
      }

      const accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      const refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : undefined;
      const expiresAtMs =
        typeof token.accessTokenExpiresAt === "number" ? token.accessTokenExpiresAt : undefined;
      const ttlMs = typeof token.accessTokenTtlMs === "number" ? token.accessTokenTtlMs : undefined;

      if (
        !shouldRefreshAccessToken({
          expiresAtMs,
          ttlMs,
          accessToken,
        })
      ) {
        return token;
      }

      if (!refreshToken) {
        token.error = "RefreshAccessTokenError";
        clearAccessTokenFromJwt(token);
        return token;
      }

      const refreshed = await refreshSessionTokens(refreshToken);
      if (!refreshed.success) {
        token.error = "RefreshAccessTokenError";
        clearAccessTokenFromJwt(token);
        token.refreshToken = undefined;
        return token;
      }

      applyAccessTokenToJwt(token, refreshed.data.accessToken);
      token.refreshToken = refreshed.data.refreshToken;
      token.error = undefined;

      return token;
    },
    async session({ session, token }) {
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.error = typeof token.error === "string" ? token.error : undefined;

      if (session.user) {
        session.user.id = token.sub ?? "";
      }

      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = Boolean(session?.user) && !session?.error;
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
