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

export async function saveOverheadBudgets(year: number, rows: Array<{ month: number; category: string; amount: number }>) {
  await prisma.$transaction(rows.map((row) => { const period = new Date(Date.UTC(year, row.month, 1)); return prisma.monthlyOverheadBudget.upsert({ where: { period_category: { period, category: row.category } }, update: { amount: Number(row.amount || 0) }, create: { period, category: row.category, amount: Number(row.amount || 0) } }); }));
  revalidatePath("/istream/budgets"); revalidatePath("/istream/dashboard"); return { ok: true as const };
}

export type OverheadInput = { id?: string; expenseDate: string; category: string; payee: string; description: string; amount: number; paymentStatus: string; paymentDate?: string; reference?: string; attachmentUrl?: string; recurring?: boolean; expenseType?: string };
export async function saveBusinessOverhead(input: OverheadInput) {
  if (!input.payee.trim() || !input.description.trim()) return { ok: false as const, error: "Payee and description are required." };
  const data = { expenseDate: new Date(`${input.expenseDate}T12:00:00`), category: input.category, payee: input.payee.trim(), description: input.description.trim(), amount: Number(input.amount || 0), paymentStatus: input.paymentStatus, paymentDate: input.paymentDate ? new Date(`${input.paymentDate}T12:00:00`) : null, reference: input.reference || null, attachmentUrl: input.attachmentUrl || null, recurring: Boolean(input.recurring), expenseType: input.expenseType || "OPERATING" };
  const overhead = input.id ? await prisma.businessOverhead.update({ where: { id: input.id }, data }) : await prisma.businessOverhead.create({ data });
  revalidatePath("/istream/overheads"); revalidatePath("/istream/dashboard"); return { ok: true as const, overhead };
}
export async function deleteBusinessOverhead(id: string) { await prisma.businessOverhead.delete({ where: { id } }); revalidatePath("/istream/overheads"); revalidatePath("/istream/dashboard"); return { ok: true as const }; }

export async function getFinancialControl(year: number) {
  const start = new Date(Date.UTC(year, 0, 1)); const end = new Date(Date.UTC(year + 1, 0, 1));
  const [budgets, overheadBudgets, quotations, jobs, expenses, overheads] = await Promise.all([
    prisma.monthlyBusinessBudget.findMany({ where: { period: { gte: start, lt: end } }, orderBy: { period: "asc" } }),
    prisma.monthlyOverheadBudget.findMany({ where: { period: { gte: start, lt: end } }, orderBy: [{ period: "asc" }, { category: "asc" }] }),
    prisma.quotation.findMany({ where: { deletedAt: null, quotationDate: { gte: start, lt: end } }, include: { lines: true } }),
    prisma.project.findMany({ where: { deletedAt: null, quotations: { some: {} } }, include: { finance: true, quotations: { include: { client: true }, take: 1 } } }),
    prisma.jobExpense.findMany({
      where: { OR: [{ paymentDate: { gte: start, lt: end } }, { paymentDate: null, createdAt: { gte: start, lt: end } }] },
      include: { project: { include: { quotations: { include: { client: true }, take: 1 } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.businessOverhead.findMany({ where: { expenseDate: { gte: start, lt: end } }, orderBy: { expenseDate: "desc" } }),
  ]);
  const months = Array.from({ length: 12 }, (_, month) => {
    const budget = budgets.find((row) => row.period.getUTCMonth() === month);
    const quoted = quotations.filter((q) => q.quotationDate.getUTCMonth() === month).reduce((sum, q) => sum + q.lines.reduce((lineSum, line) => lineSum + line.quantity * line.days * line.unitPrice, 0) * (1 + q.vatRate / 100), 0);
    const invoiced = jobs.filter((j) => j.finance?.invoiceDate?.getUTCFullYear() === year && j.finance.invoiceDate.getUTCMonth() === month).reduce((sum, j) => sum + (j.finance?.invoiceAmount || 0), 0);
    const received = jobs.filter((j) => j.finance?.paymentDate?.getUTCFullYear() === year && j.finance.paymentDate.getUTCMonth() === month).reduce((sum, j) => sum + (j.finance?.amountReceived || 0), 0);
    const actualExpenses = expenses.filter((e) => (e.paymentDate || e.createdAt).getUTCMonth() === month).reduce((sum, e) => sum + e.actualCost, 0);
    const overheadBudget = overheadBudgets.filter((row) => row.period.getUTCMonth() === month).reduce((sum, row) => sum + row.amount, 0);
    const actualOverheads = overheads.filter((row) => row.expenseDate.getUTCMonth() === month && row.expenseType === "OPERATING").reduce((sum, row) => sum + row.amount, 0);
    const capitalExpenditure = overheads.filter((row) => row.expenseDate.getUTCMonth() === month && row.expenseType === "CAPITAL").reduce((sum, row) => sum + row.amount, 0);
    return { month, salesBudget: budget?.salesBudget || 0, expenseBudget: budget?.expenseBudget || 0, overheadBudget, notes: budget?.notes || "", quoted, invoiced, received, actualExpenses, actualOverheads, capitalExpenditure };
  });
  return { months, expenses, jobs, overheads, overheadBudgets };
}
