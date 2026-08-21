CREATE TABLE "JobExpense" (
  "id" TEXT NOT NULL,
  "supplier" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "estimatedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "actualCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
  "reference" TEXT,
  "paymentDate" TIMESTAMP(3),
  "attachmentUrl" TEXT,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "JobExpense_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "JobExpense_projectId_createdAt_idx" ON "JobExpense"("projectId", "createdAt");
CREATE INDEX "JobExpense_paymentStatus_idx" ON "JobExpense"("paymentStatus");
ALTER TABLE "JobExpense" ADD CONSTRAINT "JobExpense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
