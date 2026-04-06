import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Expand } from "lucide-react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Ensures bundled marker images work under Vite (Leaflet's defaults break in bundlers). */
function useFixLeafletIcons() {
  useEffect(() => {
    const icon = L.icon({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = icon;
  }, []);
}

/** Recenters tiles after container size changes (e.g. dialog open). */
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

type MapInnerProps = {
  lat: number;
  lng: number;
  label: string;
  className?: string;
  /** When true, runs invalidateSize on mount (use inside dialog). */
  withResizeHandler?: boolean;
};

function MapInner({ lat, lng, label, className, withResizeHandler }: MapInnerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      scrollWheelZoom
      className={cn(
        "z-0 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:bg-background/90",
        className,
      )}
    >
      {withResizeHandler ? <MapResizeHandler /> : null}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}

type Props = {
  lat: number;
  lng: number;
  label: string;
};

/** Inline map plus an expand control that opens a large modal map. */
export default function RestaurantMap({ lat, lng, label }: Props) {
  useFixLeafletIcons();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-surface-border bg-muted/30 shadow-sm">
        <MapInner lat={lat} lng={lng} label={label} className="h-72 w-full overflow-hidden md:h-80" />
        <div className="absolute bottom-3 right-3 z-[1000]">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-9 gap-1.5 border border-surface-border bg-background/95 shadow-md backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              setExpanded(true);
            }}
          >
            <Expand className="size-4" />
            Expand map
          </Button>
        </div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          className={cn(
            "flex flex-col gap-0 overflow-hidden p-0",
            "h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-none border-0",
            "sm:left-[50%] sm:top-[50%] sm:h-[min(92dvh,880px)] sm:max-h-[92dvh] sm:w-[min(96vw,1200px)] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-xl sm:border",
            "[&>button]:z-[2000] [&>button]:rounded-md [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:p-1.5 [&>button]:shadow-md",
          )}
        >
          <DialogTitle className="sr-only">Map — {label}</DialogTitle>
          <div className="relative h-full w-full flex-1 overflow-hidden sm:rounded-xl">
            {expanded ? (
              <MapInner
                key={`expanded-${lat}-${lng}`}
                lat={lat}
                lng={lng}
                label={label}
                withResizeHandler
                className="h-full min-h-[320px] w-full"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
