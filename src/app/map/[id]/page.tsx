import { notFound } from "next/navigation";

import { fetchMapData, NotionMapData } from "@/lib/notion";
import NotionMap from "@/components/NotionMap";

interface MapPageProps {
  params: {
    id: string;
  };
}

export default async function MapPage({ params }: MapPageProps) {
  const { id } = params;

  let notionMap: NotionMapData;

  try {
    notionMap = await fetchMapData(id);
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return notFound(); // Show 404 page if the database is not found or error occurs
  }

  if (!notionMap || notionMap.locations.length === 0) {
    return notFound(); // Show 404 if no locations are found
  }

  return (
    <div>
      <NotionMap
        locations={notionMap.locations}
        mapHeight={notionMap.mapHeight}
        mapImageUrl="https://i.imgur.com/NrRgUWE.jpeg"
        mapWidth={notionMap.mapWidth}
      />
    </div>
  );
}
