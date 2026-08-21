"use server";

import { revalidatePath } from "next/cache";
import { financeRepository } from "@/lib/repositories/finance.repository";
import { logActivity } from "./activity.actions";
import { prisma } from "@/lib/prisma";

export async function getFinance(
  projectId: string
) {
  const [finance, expenses] = await Promise.all([
    financeRepository.get(projectId),
    prisma.jobExpense.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }),
  ]);
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true, jobNo: true, status: true, closedAt: true, closureNote: true } });
  return { finance, expenses, project };
}

export type JobExpenseInput = { id?: string; projectId: string; supplier: string; category: string; description: string; estimatedCost: number; actualCost: number; paymentStatus: string; reference?: string; paymentDate?: string; attachmentUrl?: string };

async function syncExpenseTotals(projectId: string) {
  const totals = await prisma.jobExpense.aggregate({ where: { projectId }, _sum: { estimatedCost: true, actualCost: true } });
  await prisma.finance.upsert({ where: { projectId }, update: { forecastCost: totals._sum.estimatedCost || 0, actualCost: totals._sum.actualCost || 0 }, create: { projectId, forecastCost: totals._sum.estimatedCost || 0, actualCost: totals._sum.actualCost || 0 } });
}

export async function saveJobExpense(input: JobExpenseInput) {
  if (!input.supplier.trim() || !input.description.trim()) return { ok: false as const, error: "Supplier and description are required." };
  const data = { projectId: input.projectId, supplier: input.supplier.trim(), category: input.category || "Other", description: input.description.trim(), estimatedCost: Number(input.estimatedCost || 0), actualCost: Number(input.actualCost || 0), paymentStatus: input.paymentStatus || "UNPAID", reference: input.reference || null, paymentDate: input.paymentDate ? new Date(`${input.paymentDate}T12:00:00`) : null, attachmentUrl: input.attachmentUrl || null };
  const expense = input.id ? await prisma.jobExpense.update({ where: { id: input.id }, data }) : await prisma.jobExpense.create({ data });
  await syncExpenseTotals(input.projectId);
  revalidatePath(`/projects/${input.projectId}`); revalidatePath("/istream/jobs");
  return { ok: true as const, expense };
}

export async function deleteJobExpense(id: string, projectId: string) {
  await prisma.jobExpense.delete({ where: { id } });
  await syncExpenseTotals(projectId);
  revalidatePath(`/projects/${projectId}`); revalidatePath("/istream/jobs");
  return { ok: true as const };
}

export async function saveClientPayment(projectId: string, input: { approvedBudget: number; contingency: number; currency: string; invoiceNo?: string; invoiceDate?: string; invoiceAmount: number; amountReceived: number; paymentDate?: string; paymentRef?: string }) {
  const finance = await prisma.finance.upsert({ where: { projectId }, update: {
    approvedBudget: Number(input.approvedBudget || 0), contingency: Number(input.contingency || 0), currency: input.currency || "USD",
    invoiceNo: input.invoiceNo || null, invoiceDate: input.invoiceDate ? new Date(`${input.invoiceDate}T12:00:00`) : null,
    invoiceAmount: Number(input.invoiceAmount || 0), amountReceived: Number(input.amountReceived || 0),
    paymentDate: input.paymentDate ? new Date(`${input.paymentDate}T12:00:00`) : null, paymentRef: input.paymentRef || null,
  }, create: { projectId, approvedBudget: Number(input.approvedBudget || 0), contingency: Number(input.contingency || 0), currency: input.currency || "USD", invoiceNo: input.invoiceNo || null, invoiceDate: input.invoiceDate ? new Date(`${input.invoiceDate}T12:00:00`) : null, invoiceAmount: Number(input.invoiceAmount || 0), amountReceived: Number(input.amountReceived || 0), paymentDate: input.paymentDate ? new Date(`${input.paymentDate}T12:00:00`) : null, paymentRef: input.paymentRef || null } });
  revalidatePath(`/projects/${projectId}`); revalidatePath("/istream/jobs"); revalidatePath("/");
  return { ok: true as const, finance };
}

export async function setJobLifecycle(projectId: string, status: "Planned" | "Active" | "Completed" | "Paid / Closed" | "Cancelled", closureNote?: string) {
  const [finance, unpaidSuppliers] = await Promise.all([
    prisma.finance.findUnique({ where: { projectId } }),
    prisma.jobExpense.count({ where: { projectId, paymentStatus: { not: "PAID" }, actualCost: { gt: 0 } } }),
  ]);
  if (status === "Paid / Closed") {
    const billed = finance?.invoiceAmount || finance?.approvedBudget || 0;
    if ((finance?.amountReceived || 0) < billed) return { ok: false as const, error: "Client payment is still outstanding. Record the full amount received before closing as paid." };
    if (unpaidSuppliers > 0) return { ok: false as const, error: `${unpaidSuppliers} supplier expense(s) are still unpaid.` };
  }
  await prisma.project.update({ where: { id: projectId }, data: { status, closedAt: status === "Paid / Closed" || status === "Cancelled" ? new Date() : null, closureNote: closureNote || null } });
  revalidatePath(`/projects/${projectId}`); revalidatePath("/istream/jobs"); revalidatePath("/");
  return { ok: true as const };
}

export async function updateFinance(
  projectId: string,
  data: {
    approvedBudget?: number;
    forecastCost?: number;
    actualCost?: number;
    contingency?: number;
    currency?: string;
  }
) {
  const finance =
    await financeRepository.update(
      projectId,
      data
    );

  await logActivity({
    type: "FINANCE_UPDATED",
    title: "Finance updated",
    projectId,
  });

  revalidatePath(`/projects/${projectId}`);

  return finance;
}
