import { Client, isFullDatabase, isFullPage } from "@notionhq/client";
import {
  CreatePageParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { getPropertyValue, hasCorrectProperties } from "./utils";

export interface NotionLocation {
  id: string;
  name: string;
  type: string;
  description: string;
  coordinateX: number;
  coordinateY: number;
  detailsUrl: string;
}

export interface NotionMapData {
  mapImageUrl: string;
  mapHeight: number;
  mapWidth: number;
  locations: NotionLocation[];
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function fetchMapData(databaseId: string): Promise<NotionMapData> {
  const mapDatabase = await notion.databases.retrieve({
    database_id: databaseId,
  });

  if (!isFullDatabase(mapDatabase)) {
    throw new Error("Not a database!");
  }

  if (!hasCorrectProperties(mapDatabase)) {
    throw new Error("Database does not have valid properties!");
  }

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
  });

  const locations = response.results
    .filter((page) => isFullPage(page))
    .filter((page) => {
      return !getPropertyValue(page.properties["__is_metadata"]);
    })
    .map<NotionLocation>((page) => {
      return {
        id: page.id,
        name: getPropertyValue(page.properties["Name"]) as string,
        type: getPropertyValue(page.properties["Type"]) as string,
        description: getPropertyValue(page.properties["Description"]) as string,
        coordinateX: getPropertyValue(
          page.properties["__coordinate_x"],
        ) as number,
        coordinateY: getPropertyValue(
          page.properties["__coordinate_y"],
        ) as number,
        detailsUrl: page.url,
      };
    });

  const metadata = response.results.find(
    (page) =>
      isFullPage(page) && getPropertyValue(page.properties["__is_metadata"]),
  );

  if (!metadata || !isFullPage(metadata)) {
    throw new Error("Metadata not found");
  }

  const mapImageUrl = getPropertyValue(
    metadata.properties["__metadata_map_image"],
  ) as string | undefined;
  const mapHeight = getPropertyValue(
    metadata.properties["__metadata_map_height"],
  ) as number | undefined;
  const mapWidth = getPropertyValue(
    metadata.properties["__metadata_map_width"],
  ) as number | undefined;

  if (!mapImageUrl || !mapHeight || !mapWidth) {
    throw new Error("Metadata does not have required properties");
  }

  return {
    mapImageUrl: mapImageUrl,
    mapHeight: mapHeight,
    mapWidth: mapWidth,
    locations: locations,
  };
}

export async function findNotionPages(query: string) {
  return notion.search({
    query,
    filter: { value: "database", property: "object" },
  });
}

export async function createNotionPage(params: CreatePageParameters) {
  return notion.pages.create(params);
}

export async function deleteNotionPage(id: string) {
  return notion.pages.update({
    page_id: id,
    archived: true,
  });
}
