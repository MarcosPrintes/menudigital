import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    /** Unix ms when the API access token expires (from JWT `exp`, set at login/refresh). */
    accessTokenExpiresAt?: number;
    /** Access token lifetime in ms (`exp` − `iat`), for refresh margin on short-lived tokens. */
    accessTokenTtlMs?: number;
    refreshToken?: string;
    error?: string;
  }
}
