import { NextRequest, NextResponse } from "next/server";
import { createGoogleDriveConnection } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const returnTo = request.cookies.get("google_oauth_return_to")?.value === "/calendar" ? "/calendar" : "/documents";
  if (!code || state !== request.cookies.get("google_drive_oauth_state")?.value) return NextResponse.redirect(new URL(`${returnTo}?google=error`, request.url));
  try {
    await createGoogleDriveConnection(code);
    const response = NextResponse.redirect(new URL(`${returnTo}?google=connected`, request.url));
    response.cookies.delete("google_drive_oauth_state");
    response.cookies.delete("google_oauth_return_to");
    return response;
  } catch {
    return NextResponse.redirect(new URL(`${returnTo}?google=error`, request.url));
  }
}
