export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  hours: string;
  price: string;
  shortDescription: string;
  city: string;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Osteria della Pace",
    cuisine: "Italian",
    rating: 4.7,
    address: "128 Mulberry St, New York, NY 10013",
    coordinates: { lat: 40.7189, lng: -73.9973 },
    phone: "+1 (212) 555-0142",
    hours: "Open daily · 11:00 AM – 11:00 PM",
    price: "$$$",
    shortDescription: "A beloved neighborhood trattoria known for its handmade pasta and rustic Italian dishes. The candlelit dining room transports you straight to Tuscany.",
    city: "New York",
  },
  {
    id: "2",
    name: "Sakura Omakase",
    cuisine: "Japanese",
    rating: 4.9,
    address: "3-14-1 Shinjuku, Tokyo 160-0022",
    coordinates: { lat: 35.6894, lng: 139.6917 },
    phone: "+81 3-5555-0198",
    hours: "Open daily · 5:00 PM – 11:00 PM",
    price: "$$$$",
    shortDescription: "An intimate 12-seat omakase counter helmed by Chef Tanaka, serving meticulously crafted nigiri and seasonal kaiseki courses.",
    city: "Tokyo",
  },
  {
    id: "3",
    name: "Kusina ni Lola",
    cuisine: "Filipino",
    rating: 4.3,
    address: "45 Poblacion St, Makati, Manila",
    coordinates: { lat: 14.5547, lng: 121.0244 },
    phone: "+63 2 8555 0167",
    hours: "Open daily · 10:00 AM – 10:00 PM",
    price: "$$",
    shortDescription: "A warm, family-run restaurant serving heirloom Filipino recipes passed down through generations. The kare-kare and sinigang are legendary.",
    city: "Manila",
  },
  {
    id: "4",
    name: "Taqueria El Sol",
    cuisine: "Mexican",
    rating: 4.5,
    address: "891 Mission St, San Francisco, CA 94103",
    coordinates: { lat: 37.7825, lng: -122.4056 },
    phone: "+1 (415) 555-0234",
    hours: "Open daily · 9:00 AM – 12:00 AM",
    price: "$$",
    shortDescription: "Vibrant and lively, this taqueria serves authentic Oaxacan street food with house-made tortillas and smoky mole that keeps locals coming back.",
    city: "New York",
  },
  {
    id: "5",
    name: "The Smoke & Barrel",
    cuisine: "American",
    rating: 4.1,
    address: "22 W 32nd St, New York, NY 10001",
    coordinates: { lat: 40.7484, lng: -73.9857 },
    phone: "+1 (212) 555-0389",
    hours: "Open daily · 11:30 AM – 10:00 PM",
    price: "$$$",
    shortDescription: "A refined take on American smokehouse classics, with 14-hour brisket, craft bourbons, and a live jazz soundtrack on weekends.",
    city: "New York",
  },
  {
    id: "6",
    name: "Baan Thai Kitchen",
    cuisine: "Thai",
    rating: 4.6,
    address: "15 Sukhumvit Soi 11, Bangkok 10110",
    coordinates: { lat: 13.7447, lng: 100.5519 },
    phone: "+66 2 555 0412",
    hours: "Open daily · 10:00 AM – 10:30 PM",
    price: "$$",
    shortDescription: "Authentic central Thai cuisine in an airy garden setting. Known for explosive som tum and the creamiest green curry in the neighborhood.",
    city: "Tokyo",
  },
  {
    id: "7",
    name: "Golden Dragon Palace",
    cuisine: "Chinese",
    rating: 3.8,
    address: "88 Mott St, New York, NY 10013",
    coordinates: { lat: 40.7157, lng: -73.9981 },
    phone: "+1 (212) 555-0567",
    hours: "Open daily · 10:00 AM – 11:30 PM",
    price: "$$",
    shortDescription: "A Chinatown institution for over 30 years, serving generous portions of Cantonese roast duck, dim sum, and hand-pulled noodles.",
    city: "New York",
  },
  {
    id: "8",
    name: "Le Petit Bistro",
    cuisine: "French",
    rating: 4.4,
    address: "27 Rue de Fleurus, 75006 Paris",
    coordinates: { lat: 48.8462, lng: 2.3321 },
    phone: "+33 1 55 55 01 89",
    hours: "Tue–Sun · 12:00 PM – 10:30 PM",
    price: "$$$",
    shortDescription: "A quintessential Parisian bistro tucked on a quiet Left Bank street. The duck confit and crème brûlée are simply flawless.",
    city: "Paris",
  },
  {
    id: "9",
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.2,
    address: "34 Brick Lane, London E1 6RF",
    coordinates: { lat: 51.5215, lng: -0.0722 },
    phone: "+44 20 5555 0234",
    hours: "Open daily · 12:00 PM – 11:00 PM",
    price: "$$",
    shortDescription: "A modern Indian kitchen bringing bold regional flavors to Brick Lane. The lamb rogan josh and garlic naan are absolute must-orders.",
    city: "London",
  },
  {
    id: "10",
    name: "Harbour View Grill",
    cuisine: "American",
    rating: 3.1,
    address: "7 Circular Quay, Sydney NSW 2000",
    coordinates: { lat: -33.8568, lng: 151.2153 },
    phone: "+61 2 5555 0178",
    hours: "Open daily · 11:00 AM – 10:00 PM",
    price: "$$$",
    shortDescription: "Waterfront dining with panoramic views of the Sydney Opera House. The menu leans on fresh local seafood and premium aged steaks.",
    city: "Sydney",
  },
  {
    id: "11",
    name: "Ramen Ichiban",
    cuisine: "Japanese",
    rating: 3.5,
    address: "2-1-5 Dogenzaka, Shibuya, Tokyo 150-0043",
    coordinates: { lat: 35.6580, lng: 139.6994 },
    phone: "+81 3-5555-0321",
    hours: "Open daily · 11:00 AM – 2:00 AM",
    price: "$",
    shortDescription: "A no-frills ramen shop where the tonkotsu broth simmers for 18 hours. Late-night queues are a badge of honor here.",
    city: "Tokyo",
  },
  {
    id: "12",
    name: "Mariscos del Puerto",
    cuisine: "Mexican",
    rating: 4.8,
    address: "Av. del Puerto 234, Manila Bay",
    coordinates: { lat: 14.5836, lng: 120.9799 },
    phone: "+63 2 8555 0299",
    hours: "Open daily · 10:00 AM – 9:00 PM",
    price: "$$",
    shortDescription: "Fresh-catch seafood meets Mexican coastal cooking on the Manila waterfront. The aguachile and ceviche are unmatched in the city.",
    city: "Manila",
  },
];

export function getRestaurantsByCity(city: string): Restaurant[] {
  if (!city) return restaurants;
  const lower = city.toLowerCase();
  return restaurants.filter((r) => r.city.toLowerCase().includes(lower));
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}

export function getSimilarRestaurants(id: string, limit = 3): Restaurant[] {
  const current = getRestaurantById(id);
  if (!current) return restaurants.slice(0, limit);
  return restaurants
    .filter((r) => r.id !== id)
    .sort((a, b) => {
      if (a.cuisine === current.cuisine && b.cuisine !== current.cuisine) return -1;
      if (b.cuisine === current.cuisine && a.cuisine !== current.cuisine) return 1;
      return b.rating - a.rating;
    })
    .slice(0, limit);
}
