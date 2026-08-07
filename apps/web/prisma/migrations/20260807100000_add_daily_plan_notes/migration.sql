-- CreateTable
CREATE TABLE "DailyPlanNote" (
  "id" TEXT NOT NULL,
  "dailyPlanId" TEXT NOT NULL,
  "journalEntryId" TEXT NOT NULL,
  CONSTRAINT "DailyPlanNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyPlanNote_dailyPlanId_journalEntryId_key" ON "DailyPlanNote"("dailyPlanId", "journalEntryId");

-- AddForeignKey
ALTER TABLE "DailyPlanNote" ADD CONSTRAINT "DailyPlanNote_dailyPlanId_fkey" FOREIGN KEY ("dailyPlanId") REFERENCES "DailyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DailyPlanNote" ADD CONSTRAINT "DailyPlanNote_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
