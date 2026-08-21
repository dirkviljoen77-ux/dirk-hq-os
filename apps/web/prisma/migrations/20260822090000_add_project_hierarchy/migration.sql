ALTER TABLE "Project" ADD COLUMN "parentProjectId" TEXT;
ALTER TABLE "Quotation" ADD COLUMN "businessProjectId" TEXT;
CREATE INDEX "Project_parentProjectId_idx" ON "Project"("parentProjectId");
CREATE INDEX "Quotation_businessProjectId_idx" ON "Quotation"("businessProjectId");
ALTER TABLE "Project" ADD CONSTRAINT "Project_parentProjectId_fkey" FOREIGN KEY ("parentProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_businessProjectId_fkey" FOREIGN KEY ("businessProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
