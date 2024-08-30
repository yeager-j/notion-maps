"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { ImageOverlay, MapContainer, Marker, Popup } from "react-leaflet";
import { CRS, Icon, LatLng, LatLngBoundsExpression, Point } from "leaflet";
import Link from "next/link";
import {
  ElementRef,
  startTransition,
  useCallback,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { isFullPage } from "@notionhq/client";
import { toast } from "sonner";

import { LocationType, NotionMapProps } from "@/components/NotionMap/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createLocation, deleteLocation, getCurrentMap } from "@/app/actions";
import { NotionLocation } from "@/lib/notion/api";
import MapContextMenu from "@/components/NotionMap/MapContextMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import markerSvg from "../../../public/map-pin.svg";

const markerIcon = new Icon({
  iconUrl: markerSvg.src,
  iconRetinaUrl: markerSvg.src,
  iconSize: new Point(48, 48),
});

export default function NotionMap({
  databaseId,
  locations: initialLocations,
  mapImageUrl,
  mapWidth,
  mapHeight,
}: NotionMapProps) {
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [mapHeight, mapWidth],
  ];
  const [clickedPosition, setClickedPosition] = useState<LatLng | null>(null);
  const [locations, setLocations] =
    useState<NotionLocation[]>(initialLocations);
  const mapRef = useRef<ElementRef<typeof MapContainer>>(null);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (mapRef.current) {
      const point = mapRef.current.mouseEventToLatLng(e.nativeEvent);
      setClickedPosition(point);
    }
  }, []);

  function handleMapSync() {
    startTransition(async () => {
      try {
        const syncedLocations = await getCurrentMap(databaseId);

        setLocations(syncedLocations.locations);
      } catch (error) {
        console.error(error);
        toast.error("There was an issue syncing the map.");
      }
    });
  }

  function handleCreateLocation(type: LocationType) {
    if (clickedPosition) {
      startTransition(() => {
        toast.promise(
          createLocation(
            databaseId,
            type,
            clickedPosition.lng,
            clickedPosition.lat,
          ),
          {
            loading: "Loading...",
            success: (newLocation) => {
              if (isFullPage(newLocation)) {
                setLocations((prevLocations) => [
                  ...prevLocations,
                  {
                    id: newLocation.id,
                    name: "Untitled Location",
                    type: type,
                    description: "Newly created location",
                    coordinateX: clickedPosition.lng,
                    coordinateY: clickedPosition.lat,
                    detailsUrl: newLocation.url,
                  },
                ]);
              }

              return "Successfully created a location.";
            },
            error: "There was an issue creating a location.",
          },
        );
      });
    }
  }

  function handleDeleteLocation(id: string) {
    startTransition(() => {
      toast.promise(deleteLocation(id), {
        loading: "Loading...",
        success: "Successfully deleted location.",
        error: "There was an issue deleting the location.",
      });
    });
  }

  return (
    <MapContextMenu handleCreateLocation={handleCreateLocation}>
      <div onContextMenu={handleContextMenu} onFocus={handleMapSync}>
        <MapContainer
          center={[mapHeight / 2, mapWidth / 2]}
          crs={CRS.Simple}
          maxZoom={2}
          minZoom={-2}
          ref={mapRef}
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

                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href={location.detailsUrl} target="_blank">
                        View Details
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="secondary">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogPortal>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete this location in your Notion
                              Database. It will go to your Trash and be
                              available temporarily.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                onClick={() =>
                                  handleDeleteLocation(location.id)
                                }
                                variant="destructive"
                              >
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogPortal>
                    </AlertDialog>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </MapContextMenu>
  );
}
