import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.note.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspace.deleteMany();

  // Create Dirk HQ Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Dirk HQ",
      description: "Executive Operating System",
    },
  });

  // Seed Projects
  await prisma.project.createMany({
    data: [
      {
        name: "Dirk HQ OS",
        description: "Executive Operating System",
        status: "Active",
        workspaceId: workspace.id,
      },
      {
        name: "BHPC",
        description: "Borrowdale High Performance Centre",
        status: "Active",
        workspaceId: workspace.id,
      },
      {
        name: "Broadcast Platform",
        description: "Production Platform",
        status: "Planning",
        workspaceId: workspace.id,
      },
      {
        name: "Podcast Studio",
        description: "Studio Build",
        status: "Planning",
        workspaceId: workspace.id,
      },
      {
        name: "Zimbabwe Rugby",
        description: "High Performance Programme",
        status: "Active",
        workspaceId: workspace.id,
      },
    ],
  });

  console.log("✅ Dirk HQ database seeded.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });