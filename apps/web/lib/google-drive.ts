import { prisma } from "@/lib/prisma";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const CALENDAR_READ_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function getOAuthCredentials() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google OAuth is not configured.");
  return { clientId, clientSecret };
}

function getOAuthConfig() {
  const { clientId, clientSecret } = getOAuthCredentials();
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (!redirectUri) throw new Error("Google OAuth redirect URL is not configured.");
  return { clientId, clientSecret, redirectUri };
}

export function getGoogleDriveAuthorizationUrl(state: string) {
  const { clientId, redirectUri } = getOAuthConfig();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: `${DRIVE_SCOPE} ${CALENDAR_READ_SCOPE}`, access_type: "offline", prompt: "consent", state }).toString();
  return url.toString();
}

export async function createGoogleDriveConnection(code: string) {
  const { clientId, clientSecret, redirectUri } = getOAuthConfig();
  const tokenResponse = await fetch(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
  if (!tokenResponse.ok) throw new Error("Google authorization failed.");
  const tokens = await tokenResponse.json() as { access_token: string; refresh_token?: string };
  if (!tokens.refresh_token) throw new Error("Google did not return a refresh token. Reconnect and approve access.");
  const folderResponse = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", { method: "POST", headers: { Authorization: `Bearer ${tokens.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ name: "Dirk HQ Documents", mimeType: "application/vnd.google-apps.folder" }) });
  if (!folderResponse.ok) throw new Error("Google Drive folder setup failed.");
  const folder = await folderResponse.json() as { id: string };
  await prisma.googleDriveConnection.upsert({ where: { id: "default" }, update: { refreshToken: tokens.refresh_token, folderId: folder.id }, create: { id: "default", refreshToken: tokens.refresh_token, folderId: folder.id } });
}

async function getAccessToken() {
  const connection = await prisma.googleDriveConnection.findUnique({ where: { id: "default" } });
  if (!connection) throw new Error("Connect Google Drive before uploading.");
  const { clientId, clientSecret } = getOAuthCredentials();
  const response = await fetch(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: connection.refreshToken, grant_type: "refresh_token" }) });
  if (!response.ok) throw new Error("Google Drive connection expired. Connect Google Drive again.");
  const token = await response.json() as { access_token: string };
  return { accessToken: token.access_token, folderId: connection.folderId };
}

type GoogleCalendarEvent = {
  id?: string;
  status?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

export async function getGoogleCalendarEvents(timeMin: Date, timeMax: Date) {
  try {
    const { accessToken } = await getAccessToken();
    const query = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
    });
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return { connected: false, events: [] };
    const body = await response.json() as { items?: GoogleCalendarEvent[] };
    const events = (body.items ?? [])
      .filter((event) => event.id && event.status !== "cancelled" && (event.start?.dateTime || event.start?.date))
      .map((event) => {
        const allDay = Boolean(event.start?.date && !event.start?.dateTime);
        const start = event.start?.dateTime
          ? new Date(event.start.dateTime)
          : new Date(`${event.start?.date}T00:00:00+02:00`);
        const end = event.end?.dateTime
          ? new Date(event.end.dateTime)
          : event.end?.date
            ? new Date(`${event.end.date}T00:00:00+02:00`)
            : undefined;
        return { id: `google-${event.id}`, title: `Google: ${event.summary || "Busy"}`, start, end, allDay, color: "#8B5CF6", extendedProps: { kind: "google" } };
      });
    return { connected: true, events };
  } catch {
    return { connected: false, events: [] };
  }
}

export async function uploadToGoogleDrive(file: File) {
  const { accessToken, folderId } = await getAccessToken();
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ name: file.name, parents: [folderId] })], { type: "application/json" }));
  form.append("file", file, file.name);
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: form });
  if (!response.ok) throw new Error(`Google Drive upload failed: ${await response.text()}`);
  const uploaded = await response.json() as { id?: string; webViewLink?: string };
  if (!uploaded.id) throw new Error("Google Drive did not return a file ID.");
  return { id: uploaded.id, webViewLink: uploaded.webViewLink };
}

export async function deleteFromGoogleDrive(fileId: string) {
  const { accessToken } = await getAccessToken();
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok && response.status !== 404) {
    throw new Error("Google Drive could not delete this file.");
  }
}
