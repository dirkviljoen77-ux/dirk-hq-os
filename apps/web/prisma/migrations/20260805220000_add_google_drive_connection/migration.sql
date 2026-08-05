CREATE TABLE "GoogleDriveConnection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "refreshToken" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GoogleDriveConnection_pkey" PRIMARY KEY ("id")
);
