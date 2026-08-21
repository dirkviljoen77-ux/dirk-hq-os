CREATE TABLE "QuotationRevision" (
  "id" TEXT NOT NULL,
  "revision" INTEGER NOT NULL,
  "snapshot" JSONB NOT NULL,
  "quotationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuotationRevision_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "QuotationRevision_quotationId_revision_key" ON "QuotationRevision"("quotationId", "revision");
CREATE INDEX "QuotationRevision_quotationId_createdAt_idx" ON "QuotationRevision"("quotationId", "createdAt");
ALTER TABLE "QuotationRevision" ADD CONSTRAINT "QuotationRevision_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
