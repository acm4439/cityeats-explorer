import type { Restaurant, RestaurantReview } from "@/types/restaurant";

/** Raw category object from Yelp Fusion business payloads. */
interface YelpCategory {
  title?: string;
}

/** Location block from Yelp Fusion. */
interface YelpLocation {
  display_address?: string[];
  city?: string;
}

/** Coordinates from Yelp Fusion. */
interface YelpCoordinates {
  latitude?: number;
  longitude?: number;
}

/** Open hour entry from Yelp Fusion business details. */
interface YelpOpenEntry {
  day: number;
  start: string;
  end: string;
  is_overnight?: boolean;
}

interface YelpHoursEntry {
  open?: YelpOpenEntry[];
  hours_type?: string;
}

/** Minimal business fields shared by search and detail responses. */
interface YelpBusiness {
  id: string;
  name: string;
  categories?: YelpCategory[];
  rating?: number;
  review_count?: number;
  location?: YelpLocation;
  coordinates?: YelpCoordinates;
  phone?: string;
  display_phone?: string;
  price?: string;
  hours?: YelpHoursEntry[];
  image_url?: string;
  url?: string;
  is_closed?: boolean;
}

interface YelpReviewResponse {
  reviews?: {
    id: string;
    rating?: number;
    text?: string;
    time_created?: string;
    user?: { name?: string };
  }[];
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Converts Yelp HHMM strings like "0830" into a short 12h label. */
function formatYelpTime(raw: string): string {
  const h = parseInt(raw.slice(0, 2), 10);
  const min = raw.slice(2, 4) || "00";
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${min} ${period}`;
}

/** One-line summary of hours (cards / previews). */
function formatBusinessHoursCompact(hours?: YelpHoursEntry[]): string {
  const open = hours?.[0]?.open;
  if (!open?.length) return "Hours not available";
  const parts = open.slice(0, 4).map((o) => {
    const day = DAY_NAMES[o.day] ?? "Day";
    return `${day} ${formatYelpTime(o.start)}–${formatYelpTime(o.end)}`;
  });
  return parts.join(" · ");
}

/** Multi-line schedule for the detail page when Yelp provides regular hours. */
function formatBusinessHoursDetailed(hours?: YelpHoursEntry[]): string {
  const open = hours?.[0]?.open;
  if (!open?.length) return "Hours not available";
  return open
    .map((o) => {
      const day = DAY_NAMES[o.day] ?? "Day";
      return `${day} · ${formatYelpTime(o.start)} – ${formatYelpTime(o.end)}`;
    })
    .join("\n");
}

/** Resolves a city name to coordinates via the local Nominatim proxy (needed so Yelp applies radius). */
async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  const url = `/nominatim/search?format=json&limit=1&q=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: { lat?: string; lon?: string }[] = await res.json();
  if (!Array.isArray(data) || !data[0]?.lat || !data[0]?.lon) return null;
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

/** Maps a Yelp business JSON object into our `Restaurant` shape. */
function normalizeYelpBusiness(
  business: YelpBusiness,
  searchedCity: string,
  hoursOverride?: string,
  useDetailedHours = false,
): Restaurant {
  const hoursFromApi = useDetailedHours
    ? formatBusinessHoursDetailed(business.hours)
    : formatBusinessHoursCompact(business.hours);
  return {
    id: business.id,
    name: business.name,
    cuisine: business.categories?.[0]?.title ?? "Restaurant",
    rating: business.rating ?? null,
    address: business.location?.display_address?.join(", ") ?? "Address not available",
    coordinates: {
      lat: business.coordinates?.latitude ?? null,
      lng: business.coordinates?.longitude ?? null,
    },
    phone: business.display_phone ?? business.phone ?? "Not available",
    hours: hoursOverride ?? hoursFromApi,
    price: business.price ?? "Not listed",
    shortDescription: business.categories?.map((c) => c.title).join(", ") ?? "No description available",
    city: business.location?.city?.trim() || searchedCity,
    reviewCount: business.review_count ?? null,
    imageUrl: business.image_url ?? null,
    yelpUrl: business.url ?? null,
    isClosed: business.is_closed ?? null,
  };
}

/** Searches Yelp for restaurants near a city (geocoded + 8km radius when possible). */
export async function searchRestaurants(city: string): Promise<Restaurant[]> {
  const trimmed = city.trim();
  if (!trimmed) return [];

  const coords = await geocodeCity(trimmed);
  const params = new URLSearchParams({
    term: "restaurants",
    // Yelp Fusion allows up to 50 results per search request
    limit: "50",
    radius: "8000",
  });

  if (coords) {
    params.set("latitude", String(coords.lat));
    params.set("longitude", String(coords.lng));
  } else {
    params.delete("radius");
    params.set("location", trimmed);
  }

  const res = await fetch(`/yelp-api/v3/businesses/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Yelp search failed (${res.status})`);
  }

  const json: { businesses?: YelpBusiness[] } = await res.json();
  const list = json.businesses ?? [];
  return list.map((b) => normalizeYelpBusiness(b, trimmed));
}

/** Loads one business by Yelp id (detail view — includes formatted hours when Yelp provides them). */
export async function fetchBusinessById(id: string): Promise<Restaurant> {
  const res = await fetch(`/yelp-api/v3/businesses/${encodeURIComponent(id)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error(`Yelp business failed (${res.status})`);
  }
  const business: YelpBusiness = await res.json();
  const searchedCity = business.location?.city?.trim() || "";
  return normalizeYelpBusiness(business, searchedCity, undefined, true);
}

/** Fetches up to `limit` review snippets for the detail page. */
export async function fetchBusinessReviews(businessId: string, limit = 3): Promise<RestaurantReview[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  const res = await fetch(`/yelp-api/v3/businesses/${encodeURIComponent(businessId)}/reviews?${params}`);
  if (!res.ok) return [];

  const json: YelpReviewResponse = await res.json();
  const raw = json.reviews ?? [];
  return raw
    .filter((r) => r.id && r.text)
    .map((r) => ({
      id: r.id,
      rating: r.rating ?? 0,
      text: (r.text ?? "").trim(),
      author: r.user?.name ?? "Yelp user",
      timeCreated: r.time_created ? new Date(r.time_created).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "",
    }));
}

/** Returns up to `limit` other restaurants near the same point (or city string fallback). */
export async function fetchSimilarRestaurants(
  excludeId: string,
  lat: number | null,
  lng: number | null,
  city: string,
  limit = 3,
): Promise<Restaurant[]> {
  const params = new URLSearchParams({
    term: "restaurants",
    limit: "50",
    radius: "8000",
  });

  if (lat != null && lng != null) {
    params.set("latitude", String(lat));
    params.set("longitude", String(lng));
  } else {
    params.delete("radius");
    params.set("location", city);
  }

  const res = await fetch(`/yelp-api/v3/businesses/search?${params.toString()}`);
  if (!res.ok) return [];

  const json: { businesses?: YelpBusiness[] } = await res.json();
  const list = json.businesses ?? [];
  return list
    .filter((b) => b.id !== excludeId)
    .slice(0, limit)
    .map((b) => normalizeYelpBusiness(b, city));
}
