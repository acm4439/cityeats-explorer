/** Restaurant record normalized from Yelp for the UI. */
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number | null;
  address: string;
  coordinates: { lat: number | null; lng: number | null };
  phone: string;
  hours: string;
  price: string;
  shortDescription: string;
  city: string;
  /** Yelp review count when the API returned it. */
  reviewCount: number | null;
  /** Primary photo URL (detail/search). */
  imageUrl: string | null;
  /** Link to the listing on Yelp. */
  yelpUrl: string | null;
  /** Whether Yelp marks the business as closed. */
  isClosed: boolean | null;
}

/** Short excerpt from the Yelp reviews endpoint for the detail page. */
export interface RestaurantReview {
  id: string;
  rating: number;
  text: string;
  author: string;
  /** ISO or display date from Yelp. */
  timeCreated: string;
}
