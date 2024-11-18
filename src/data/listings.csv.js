import { csvFormat, csvParse } from "d3-dsv";

// Function to load text from a URL (useful if you are using a local server or public link)
async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

// Load and parse the CSV file
const listings = csvParse(await text("https://drive.google.com/uc?id=1n4bkmOPPcbMHurgz_cAb9yyeKbuL1Gju&export=download"), (d) => ({
  id: d.id,
  hostId: d.host_id,
  hostName: d.host_name,
  name: d.name,
  neighborhood: d.neighbourhood,
  price: +d.price_usd,
  roomType: d.room_type,
  minimumNights: +d.minimum_nights,
  numberOfReviews: +d.number_of_reviews,
  lastReview: d.last_review,
  reviewsPerMonth: +d.reviews_per_month,
  numberOfReviewsLTM: +d.number_of_reviews_ltm
}));

// Write out CSV formatted data (assumes Node.js environment)
process.stdout.write(csvFormat(listings));
