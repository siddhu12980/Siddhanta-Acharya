import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE = "admin_session";

export async function createSession() {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<boolean> {
  const cookie = (await cookies()).get(COOKIE)?.value;
  if (!cookie) return false;
  try {
    await jwtVerify(cookie, SECRET, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
