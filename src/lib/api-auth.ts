import { NextRequest } from "next/server";

const FIREBASE_PROJECT_ID = "pj-yotsuba-corporate";

/**
 * Verify Firebase ID token using Google's public token info endpoint.
 * No service account needed.
 */
export async function verifyAdminRequest(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthError("認証トークンがありません", 401);
  }

  const token = authHeader.slice(7);

  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=AIzaSyAQ2_xa2Nw2vB1GivwWxWaKijpDaWpHMLw`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  );

  if (!res.ok) {
    throw new AuthError("無効な認証トークンです", 401);
  }

  const data = await res.json();
  const user = data.users?.[0];
  if (!user) {
    throw new AuthError("ユーザーが見つかりません", 401);
  }

  return {
    uid: user.localId as string,
    email: user.email as string | undefined,
  };
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
