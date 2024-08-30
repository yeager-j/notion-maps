import { NotionLocation } from "@/lib/notion/api";

export type LocationType =
  | "Megapolis"
  | "City"
  | "Town"
  | "Village"
  | "Dungeon"
  | "Point of Interest";

export interface NotionMapProps {
  databaseId: string;
  mapImageUrl: string;
  locations: NotionLocation[];
  mapHeight: number;
  mapWidth: number;
}
