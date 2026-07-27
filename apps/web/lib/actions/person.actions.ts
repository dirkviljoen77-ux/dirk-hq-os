"use server";

import { revalidatePath } from "next/cache";
import { personRepository } from "@/lib/repositories/person.repository";
import { logActivity } from "./activity.actions";

export async function getPeople(projectId: string) {
  return personRepository.findByProject(projectId);
}

export async function createPerson(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
 company?: string;
  role?: string;
  projectId?: string;
}) {
  const person = await personRepository.create(data);

  await logActivity({
    type: "PERSON_ADDED",
    title: `${data.firstName} ${data.lastName}`,
    description: "Person added to project",
    projectId: data.projectId,
  });

  if (data.projectId) {
    revalidatePath(`/projects/${data.projectId}`);
  }

  return person;
}

export async function deletePerson(id: string) {
  const person = await personRepository.findById(id);

  if (person) {
    await logActivity({
      type: "PERSON_REMOVED",
      title: `${person.firstName} ${person.lastName}`,
      description: "Person removed from project",
      projectId: person.projectId ?? undefined,
    });
  }

  return personRepository.delete(id);
}
export async function updatePerson(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    role?: string;
  }
) {
  const person = await personRepository.update(id, data);

  if (person.projectId) {
    await logActivity({
      type: "PERSON_UPDATED",
      title: `${person.firstName} ${person.lastName}`,
      description: "Person details updated",
      projectId: person.projectId,
    });

    revalidatePath(`/projects/${person.projectId}`);
  }

  return person;
}