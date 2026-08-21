CREATE TABLE "MonthlyBusinessBudget" (
  "id" TEXT NOT NULL,
  "period" TIMESTAMP(3) NOT NULL,
  "salesBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "expenseBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MonthlyBusinessBudget_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MonthlyBusinessBudget_period_key" ON "MonthlyBusinessBudget"("period");
