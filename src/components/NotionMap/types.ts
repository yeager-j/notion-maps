import { NotionLocation } from "@/lib/notion/api";

export interface NotionMapProps {
  mapImageUrl: string;
  locations: NotionLocation[];
  mapHeight: number;
  mapWidth: number;
}
