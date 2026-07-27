"use server";

import { searchRepository } from "@/lib/repositories/search.repository";

export async function searchEverything(query: string) {
  if (!query.trim()) {
    return {
      projects: [],
      tasks: [],
      meetings: [],
      people: [],
      documents: [],
    };
  }

  return searchRepository.search(query);
}