CREATE TABLE "MonthlyOverheadBudget" (
  "id" TEXT NOT NULL, "period" TIMESTAMP(3) NOT NULL, "category" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "MonthlyOverheadBudget_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MonthlyOverheadBudget_period_category_key" ON "MonthlyOverheadBudget"("period", "category");
CREATE INDEX "MonthlyOverheadBudget_period_idx" ON "MonthlyOverheadBudget"("period");
CREATE TABLE "BusinessOverhead" (
  "id" TEXT NOT NULL, "expenseDate" TIMESTAMP(3) NOT NULL, "category" TEXT NOT NULL, "payee" TEXT NOT NULL,
  "description" TEXT NOT NULL, "amount" DOUBLE PRECISION NOT NULL DEFAULT 0, "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
  "paymentDate" TIMESTAMP(3), "reference" TEXT, "attachmentUrl" TEXT, "recurring" BOOLEAN NOT NULL DEFAULT false,
  "expenseType" TEXT NOT NULL DEFAULT 'OPERATING', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "BusinessOverhead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "BusinessOverhead_expenseDate_category_idx" ON "BusinessOverhead"("expenseDate", "category");
CREATE INDEX "BusinessOverhead_paymentStatus_idx" ON "BusinessOverhead"("paymentStatus");
