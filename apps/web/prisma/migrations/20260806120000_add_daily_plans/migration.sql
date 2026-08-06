-- CreateTable
CREATE TABLE "DailyPlan" (
  "id" TEXT NOT NULL,
  "planDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DailyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPlanItem" (
  "id" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "dailyPlanId" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  CONSTRAINT "DailyPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyPlan_planDate_key" ON "DailyPlan"("planDate");
CREATE UNIQUE INDEX "DailyPlanItem_dailyPlanId_taskId_key" ON "DailyPlanItem"("dailyPlanId", "taskId");
CREATE INDEX "DailyPlanItem_dailyPlanId_position_idx" ON "DailyPlanItem"("dailyPlanId", "position");

-- AddForeignKey
ALTER TABLE "DailyPlanItem" ADD CONSTRAINT "DailyPlanItem_dailyPlanId_fkey" FOREIGN KEY ("dailyPlanId") REFERENCES "DailyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DailyPlanItem" ADD CONSTRAINT "DailyPlanItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
