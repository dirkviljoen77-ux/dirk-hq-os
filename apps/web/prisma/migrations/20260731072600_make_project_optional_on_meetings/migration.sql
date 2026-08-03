-- DropForeignKey
ALTER TABLE "public"."Meeting" DROP CONSTRAINT "Meeting_projectId_fkey";

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
