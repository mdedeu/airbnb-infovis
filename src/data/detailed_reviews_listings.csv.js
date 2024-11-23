import { csvFormat, csvParse } from "d3-dsv";

// Function to load text from a URL (useful if you are using a local server or public link)
async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

// Load and parse the CSV file
let data = csvParse(await text("https://drive.google.com/uc?id=1v3lBLcq490S4gpcooqS_QY3UHSvz-HGn&export=download"), (d) => ({  
    id: d.id,
    hostId: d.host_id,
    hostName: d.host_name,
    name: d.name,
    neighborhood: d.neighbourhood_cleansed,
    price: +d.price_usd,
    hostResponseRate: d.host_response_rate,
    hostIsSuperhost: d.host_is_superhost === 't',  // Convert 't'/'f' to boolean
    minimumNights: +d.minimum_nights,
    numberOfReviews: +d.number_of_reviews,
    rating: +d.review_scores_rating,
    cleanlinessRating: +d.review_scores_cleanliness,
    checkinRating: +d.review_scores_checkin,
    communicationRating: +d.review_scores_communication,
    locationRating: +d.review_scores_location,
    valueRating: +d.review_scores_value,
    latitude: +d.latitude,
    longitude: +d.longitude,
    hostSince: new Date(d.host_since)
  }));
// Write out CSV formatted data (assumes Node.js environment)
process.stdout.write(csvFormat(data));
