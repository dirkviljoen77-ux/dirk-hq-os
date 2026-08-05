import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { uploadToGoogleDrive } from "@/lib/google-drive";
import { activityRepository } from "@/lib/repositories/activity.repository";
import { documentRepository } from "@/lib/repositories/document.repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const projectId = formData.get("projectId");
    const name = formData.get("name");

    if (!(file instanceof File) || !projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Choose a file and project before uploading." }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Files must be 25 MB or smaller." }, { status: 400 });
    }

    const driveFile = await uploadToGoogleDrive(file);
    const document = await documentRepository.create({
      name: typeof name === "string" && name.trim() ? name.trim() : file.name,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      projectId,
      driveFileId: driveFile.id,
      webViewLink: driveFile.webViewLink ?? `https://drive.google.com/open?id=${driveFile.id}`,
    });
    await activityRepository.create({
      type: "DOCUMENT_ADDED",
      title: document.name,
      description: "Document added",
      projectId,
    });
    revalidatePath("/documents");
    revalidatePath(`/projects/${projectId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google Drive upload failed." },
      { status: 500 }
    );
  }
}
