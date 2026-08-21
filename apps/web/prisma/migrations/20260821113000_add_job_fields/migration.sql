ALTER TABLE "Project" ADD COLUMN "jobNo" TEXT;
ALTER TABLE "Project" ADD COLUMN "startDate" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN "endDate" TIMESTAMP(3);
CREATE UNIQUE INDEX "Project_jobNo_key" ON "Project"("jobNo");
