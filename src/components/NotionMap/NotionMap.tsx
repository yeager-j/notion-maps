"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { ImageOverlay, MapContainer, Marker, Popup } from "react-leaflet";
import { CRS, Icon, LatLngBoundsExpression, Point } from "leaflet";
import Link from "next/link";

import { NotionMapProps } from "@/components/NotionMap/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import markerSvg from "../../../public/map-pin.svg";

const markerIcon = new Icon({
  iconUrl: markerSvg.src,
  iconRetinaUrl: markerSvg.src,
  iconSize: new Point(48, 48),
});

export default function NotionMap({
  locations,
  mapImageUrl,
  mapWidth,
  mapHeight,
}: NotionMapProps) {
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [mapHeight, mapWidth],
  ];

  return (
    <MapContainer
      center={[mapHeight / 2, mapWidth / 2]}
      crs={CRS.Simple}
      maxZoom={2}
      minZoom={-2}
      style={{ height: "100vh", width: "100%" }}
      zoom={0}
    >
      <ImageOverlay bounds={bounds} url={mapImageUrl} />

      {locations.map((location, index) => {
        return (
          <Marker
            icon={markerIcon}
            key={index}
            position={[location.coordinateY, location.coordinateX]}
          >
            <Popup>
              <div className="prose">
                <Badge>{location.type}</Badge>
                <h1>{location.name}</h1>
                <p>{location.description}</p>
              </div>

              <Button asChild variant="secondary">
                <Link href={location.detailsUrl} target="_blank">
                  View Details
                </Link>
              </Button>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
