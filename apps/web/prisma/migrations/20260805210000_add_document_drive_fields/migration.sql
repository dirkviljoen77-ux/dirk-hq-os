ALTER TABLE "Document"
ADD COLUMN "driveFileId" TEXT,
ADD COLUMN "webViewLink" TEXT;

CREATE UNIQUE INDEX "Document_driveFileId_key" ON "Document"("driveFileId");
