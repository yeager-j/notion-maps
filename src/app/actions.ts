"use server";

import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";

import { findNotionPages } from "@/lib/notion";

export async function searchNotionDatabase(
  searchQuery: string,
): Promise<SearchResponse> {
  if (!searchQuery) {
    throw new Error("Not found query");
  }

  try {
    return findNotionPages(searchQuery);
  } catch (error) {
    throw new Error("Error searching Notion");
  }
}
