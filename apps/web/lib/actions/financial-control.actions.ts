"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function saveMonthlyBudgets(year: number, rows: Array<{ month: number; salesBudget: number; expenseBudget: number; notes?: string }>) {
  await prisma.$transaction(rows.map((row) => {
    const period = new Date(Date.UTC(year, row.month, 1));
    return prisma.monthlyBusinessBudget.upsert({ where: { period }, update: { salesBudget: Number(row.salesBudget || 0), expenseBudget: Number(row.expenseBudget || 0), notes: row.notes || null }, create: { period, salesBudget: Number(row.salesBudget || 0), expenseBudget: Number(row.expenseBudget || 0), notes: row.notes || null } });
  }));
  revalidatePath("/istream/budgets"); revalidatePath("/istream/dashboard"); revalidatePath("/");
  return { ok: true as const };
}

export async function getFinancialControl(year: number) {
  const start = new Date(Date.UTC(year, 0, 1)); const end = new Date(Date.UTC(year + 1, 0, 1));
  const [budgets, quotations, jobs, expenses] = await Promise.all([
    prisma.monthlyBusinessBudget.findMany({ where: { period: { gte: start, lt: end } }, orderBy: { period: "asc" } }),
    prisma.quotation.findMany({ where: { deletedAt: null, quotationDate: { gte: start, lt: end } }, include: { lines: true } }),
    prisma.project.findMany({ where: { deletedAt: null, quotations: { some: {} } }, include: { finance: true, quotations: { include: { client: true }, take: 1 } } }),
    prisma.jobExpense.findMany({
      where: { OR: [{ paymentDate: { gte: start, lt: end } }, { paymentDate: null, createdAt: { gte: start, lt: end } }] },
      include: { project: { include: { quotations: { include: { client: true }, take: 1 } } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const months = Array.from({ length: 12 }, (_, month) => {
    const budget = budgets.find((row) => row.period.getUTCMonth() === month);
    const quoted = quotations.filter((q) => q.quotationDate.getUTCMonth() === month).reduce((sum, q) => sum + q.lines.reduce((lineSum, line) => lineSum + line.quantity * line.days * line.unitPrice, 0) * (1 + q.vatRate / 100), 0);
    const invoiced = jobs.filter((j) => j.finance?.invoiceDate?.getUTCFullYear() === year && j.finance.invoiceDate.getUTCMonth() === month).reduce((sum, j) => sum + (j.finance?.invoiceAmount || 0), 0);
    const received = jobs.filter((j) => j.finance?.paymentDate?.getUTCFullYear() === year && j.finance.paymentDate.getUTCMonth() === month).reduce((sum, j) => sum + (j.finance?.amountReceived || 0), 0);
    const actualExpenses = expenses.filter((e) => (e.paymentDate || e.createdAt).getUTCMonth() === month).reduce((sum, e) => sum + e.actualCost, 0);
    return { month, salesBudget: budget?.salesBudget || 0, expenseBudget: budget?.expenseBudget || 0, notes: budget?.notes || "", quoted, invoiced, received, actualExpenses };
  });
  return { months, expenses, jobs };
}
