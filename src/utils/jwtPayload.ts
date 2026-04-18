import type { JWT } from "next-auth/jwt";

type JwtPayloadFields = {
  exp?: number;
  iat?: number;
};

export function decodeJwtPayload(token: string): JwtPayloadFields | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = JSON.parse(
      Buffer.from(parts[1]!, "base64url").toString("utf8")
    ) as JwtPayloadFields;
    return payload;
  } catch {
    return null;
  }
}

/** Read once when the access token is set (login / refresh) and persist on the NextAuth JWT. */
export function extractAccessTokenTiming(accessToken: string): {
  expiresAtMs: number;
  ttlMs: number | null;
} | null {
  const payload = decodeJwtPayload(accessToken);
  if (typeof payload?.exp !== "number") {
    return null;
  }

  const expiresAtMs = payload.exp * 1000;
  let ttlMs: number | null = null;
  if (typeof payload.iat === "number") {
    const ttl = expiresAtMs - payload.iat * 1000;
    ttlMs = ttl > 0 ? ttl : null;
  }

  return { expiresAtMs, ttlMs };
}

/** Milliseconds until access token expiry, or null if unknown. */
export function getAccessTokenExpiresAtMs(accessToken: string): number | null {
  return extractAccessTokenTiming(accessToken)?.expiresAtMs ?? null;
}

/**
 * NextAuth-friendly: store `exp` / TTL on the JWT cookie once, then decide refresh without
 * re-parsing the access token string on every `jwt` callback.
 * Falls back to decoding `accessToken` for older sessions that lack metadata.
 */
export function applyAccessTokenToJwt(token: JWT, accessToken: string): void {
  token.accessToken = accessToken;
  const timing = extractAccessTokenTiming(accessToken);
  if (timing) {
    token.accessTokenExpiresAt = timing.expiresAtMs;
    token.accessTokenTtlMs = timing.ttlMs ?? undefined;
  } else {
    token.accessTokenExpiresAt = undefined;
    token.accessTokenTtlMs = undefined;
  }
}

export function clearAccessTokenFromJwt(token: JWT): void {
  token.accessToken = undefined;
  token.accessTokenExpiresAt = undefined;
  token.accessTokenTtlMs = undefined;
}

export function shouldRefreshAccessToken(options: {
  expiresAtMs?: number;
  ttlMs?: number;
  accessToken?: string;
}): boolean {
  let expiresAtMs = options.expiresAtMs;
  let ttlMs = options.ttlMs;

  if (expiresAtMs === undefined && options.accessToken) {
    const timing = extractAccessTokenTiming(options.accessToken);
    if (timing) {
      expiresAtMs = timing.expiresAtMs;
      ttlMs = timing.ttlMs ?? undefined;
    }
  }

  if (expiresAtMs === undefined) {
    return true;
  }

  const now = Date.now();

  if (now >= expiresAtMs) {
    return true;
  }

  let marginMs: number;
  if (typeof ttlMs === "number" && ttlMs > 0) {
    marginMs = Math.min(60_000, Math.max(2_000, Math.floor(ttlMs * 0.15)));
  } else {
    marginMs = 60_000;
  }

  return now >= expiresAtMs - marginMs;
}
