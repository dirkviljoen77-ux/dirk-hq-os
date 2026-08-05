import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getGoogleDriveAuthorizationUrl } from "@/lib/google-drive";

export function GET() {
  const state = randomUUID();
  const response = NextResponse.redirect(getGoogleDriveAuthorizationUrl(state));
  response.cookies.set("google_drive_oauth_state", state, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" });
  return response;
}
