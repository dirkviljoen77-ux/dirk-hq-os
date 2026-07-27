import { prisma } from "@/lib/prisma";

class SearchRepository {
  async search(query: string) {
    const [
      projects,
      tasks,
      meetings,
      people,
      documents,
    ] = await Promise.all([
      prisma.project.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 5,
      }),

      prisma.task.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 5,
      }),

      prisma.meeting.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 5,
      }),

      prisma.person.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        take: 5,
      }),

      prisma.document.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 5,
      }),
    ]);

    return {
      projects,
      tasks,
      meetings,
      people,
      documents,
    };
  }
}

export const searchRepository =
  new SearchRepository();