"use server";

import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";

import {
  createNotionPage,
  deleteNotionPage,
  fetchMapData,
  findNotionPages,
} from "@/lib/notion";
import { LocationType } from "@/components/NotionMap";

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

export async function getCurrentMap(id: string) {
  return fetchMapData(id);
}

export async function createLocation(
  databaseId: string,
  type: LocationType,
  coordinateX: number,
  coordinateY: number,
) {
  return createNotionPage({
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: "Untitled Location",
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: "Newly created location",
            },
          },
        ],
      },
      Type: {
        select: {
          name: type,
        },
      },
      __coordinate_x: {
        number: coordinateX,
      },
      __coordinate_y: {
        number: coordinateY,
      },
    },
  });
}

export async function deleteLocation(id: string) {
  return deleteNotionPage(id);
}
