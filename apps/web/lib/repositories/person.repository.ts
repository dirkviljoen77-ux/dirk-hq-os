import { prisma } from "@/lib/prisma";

export interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  projectId?: string;
}

export interface UpdatePersonInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
}

class PersonRepository {
  async findByProject(projectId: string) {
    return prisma.person.findMany({
      where: {
        projectId,
      },
      orderBy: [
        {
          lastName: "asc",
        },
        {
          firstName: "asc",
        },
      ],
    });
  }

  async findById(id: string) {
    return prisma.person.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreatePersonInput) {
    return prisma.person.create({
      data,
    });
  }

  async update(id: string, data: UpdatePersonInput) {
  return prisma.person.update({
    where: {
      id,
    },
    data,
  });
}

  async delete(id: string) {
    return prisma.person.delete({
      where: {
        id,
      },
    });
  }
}

export const personRepository = new PersonRepository();