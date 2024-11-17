import { csvFormat, csvParse } from "d3-dsv";

// Function to load text from a URL
async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

// Load and parse the second CSV file
const otherAribnb = csvParse(await text("https://drive.google.com/uc?id=1n4bkmOPPcbMHurgz_cAb9yyeKbuL1Gju&export=download"), (d) => ({
  id: d.id,
  name: d.name,
  hostId: d.host_id,
  neighborhood: d.neighbourhood,
  latitude: +d.latitude,
  longitude: +d.longitude,
  roomType: d.room_type,
  price: +d.price,
  minimumNights: +d.minimum_nights,
  numberOfReviews: +d.number_of_reviews,
  lastReview: d.last_review,
  reviewsPerMonth: +d.reviews_per_month
}));

// Write out CSV formatted data (assumes Node.js environment)
process.stdout.write(csvFormat(otherAribnb));
