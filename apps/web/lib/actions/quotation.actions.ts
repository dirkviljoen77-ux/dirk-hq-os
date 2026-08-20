"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const starterCatalogue = [
  ["CAMERA", "Professional camera equipment for the production", 50],
  ["MIXER", "Vision mixer and switching equipment", 150],
  ["AUDIO", "Audio capture, monitoring and related equipment", 0],
  ["COMMS", "Production communications and intercom equipment", 0],
  ["REPLAYS", "Replay equipment and playback system", 0],
  ["EDITING", "Video editing and post-production services", 200],
  ["TOLLGATES", "Tollgate charges incurred for the production", 0],
  ["FOOD", "Meals and refreshments for the production team", 0],
  ["AIRTIME", "Airtime, mobile data and production connectivity", 0],
  ["LIGHTING", "Lighting equipment, stands and modifiers", 0],
  ["CAM-OP", "Professional camera operator", 100],
  ["AUDIO-OP", "Professional audio operator", 0],
  ["COMMENTATORS", "Commentary talent for the production", 0],
  ["TRANSPORT", "Production transport and vehicle charges", 0],
  ["FUEL", "Fuel used for production transport and equipment", 30],
  ["DIRECTOR-OP", "Production director and technical operator", 0],
  ["REPLAY-OP", "Replay system operator", 0],
] as const;

export type QuotationInput = {
  id?: string;
  quotationNo: string;
  quotationDate: string;
  validDays: number;
  projectRef?: string;
  jobDescription: string;
  vatRate: number;
  status: string;
  client: { id?: string; company: string; contactName?: string; address?: string; vatTin?: string; email?: string; phone?: string };
  lines: Array<{ catalogueItemId?: string; itemCode: string; description: string; quantity: number; days: number; unitPrice: number }>;
};

async function ensureStarterData() {
  await Promise.all(starterCatalogue.map(([code, description, unitPrice]) =>
    prisma.catalogueItem.upsert({ where: { code }, update: {}, create: { code, description, unitPrice } })
  ));
  const existing = await prisma.businessClient.findFirst({ where: { company: "V & S Healthcare T/A Fivet Animal Health" } });
  if (!existing) await prisma.businessClient.create({ data: { company: "V & S Healthcare T/A Fivet Animal Health", contactName: "Richman Tafataona", address: "Stand 4572 Pomona T/Ship\nHarare, Zimbabwe", vatTin: "220021376 / 2000002478" } });
}

export async function getQuotationWorkspace() {
  await ensureStarterData();
  const [quotations, clients, catalogue] = await Promise.all([
    prisma.quotation.findMany({ where: { deletedAt: null }, include: { client: true, lines: true }, orderBy: { updatedAt: "desc" } }),
    prisma.businessClient.findMany({ where: { deletedAt: null }, orderBy: { company: "asc" } }),
    prisma.catalogueItem.findMany({ where: { active: true }, orderBy: { code: "asc" } }),
  ]);
  return { quotations, clients, catalogue };
}

export async function getQuotation(id: string) {
  return prisma.quotation.findUnique({ where: { id }, include: { client: true, lines: { orderBy: { position: "asc" } } } });
}

export async function nextQuotationNumber() {
  const latest = await prisma.quotation.findFirst({ orderBy: { createdAt: "desc" }, select: { quotationNo: true } });
  const number = latest ? Number(latest.quotationNo.match(/(\d+)$/)?.[1] ?? 0) + 1 : 1;
  return `DSQ-${String(number).padStart(4, "0")}`;
}

export async function saveQuotation(input: QuotationInput) {
  if (!input.quotationNo.trim()) return { ok: false as const, error: "Enter a quotation number." };
  if (!input.client.company.trim()) return { ok: false as const, error: "Select or enter a client." };
  if (!input.jobDescription.trim()) return { ok: false as const, error: "Enter the job description / overview." };
  const lines = input.lines.filter((line) => line.itemCode.trim() && line.description.trim());
  if (!lines.length) return { ok: false as const, error: "Add at least one quotation line." };

  try {
    const client = input.client.id
      ? await prisma.businessClient.update({ where: { id: input.client.id }, data: { company: input.client.company, contactName: input.client.contactName, address: input.client.address, vatTin: input.client.vatTin, email: input.client.email, phone: input.client.phone } })
      : await prisma.businessClient.create({ data: { company: input.client.company, contactName: input.client.contactName, address: input.client.address, vatTin: input.client.vatTin, email: input.client.email, phone: input.client.phone } });

  const data = {
    quotationNo: input.quotationNo.trim(), quotationDate: new Date(`${input.quotationDate}T12:00:00`), validDays: input.validDays,
    projectRef: input.projectRef || null, jobDescription: input.jobDescription, vatRate: input.vatRate, status: input.status, clientId: client.id,
  };

    const quotation = input.id
      ? await prisma.$transaction(async (tx) => {
          await tx.quotationLine.deleteMany({ where: { quotationId: input.id } });
          return tx.quotation.update({ where: { id: input.id }, data: { ...data, revision: { increment: 1 }, lines: { create: lines.map((line, position) => ({ ...line, catalogueItemId: line.catalogueItemId || null, position })) } } });
        })
      : await prisma.quotation.create({ data: { ...data, lines: { create: lines.map((line, position) => ({ ...line, catalogueItemId: line.catalogueItemId || null, position })) } } });
    revalidatePath("/istream/quotations");
    revalidatePath(`/istream/quotations/${quotation.id}`);
    return { ok: true as const, quotation };
  } catch (error) {
    console.error("Unable to save quotation", error);
    return { ok: false as const, error: "The quotation could not be saved. Check the quotation number and try again." };
  }
}

export async function archiveQuotation(id: string) {
  await prisma.quotation.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/istream/quotations");
}
