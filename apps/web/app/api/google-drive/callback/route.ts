import { NextRequest, NextResponse } from "next/server";
import { createGoogleDriveConnection } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || state !== request.cookies.get("google_drive_oauth_state")?.value) return NextResponse.redirect(new URL("/documents?drive=error", request.url));
  try {
    await createGoogleDriveConnection(code);
    const response = NextResponse.redirect(new URL("/documents?drive=connected", request.url));
    response.cookies.delete("google_drive_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/documents?drive=error", request.url));
  }
}
