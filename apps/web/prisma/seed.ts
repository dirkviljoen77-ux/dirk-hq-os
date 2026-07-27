import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.document.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.task.deleteMany();
  await prisma.person.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: "Dirk HQ",
      description: "Executive Operating System",
    },
  });

  await prisma.project.createMany({
    data: [
      {
        name: "Dirk HQ OS",
        status: "Active",
        workspaceId: workspace.id,
      },
      {
        name: "BHPC Financial Model",
        status: "Active",
        workspaceId: workspace.id,
      },
      {
        name: "Zimbabwe Rugby",
        status: "Planning",
        workspaceId: workspace.id,
      },
      {
        name: "Podcast Studio",
        status: "Complete",
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