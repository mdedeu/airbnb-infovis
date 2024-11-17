import { csvFormat, csvParse } from "d3-dsv";

// Function to load text from a URL (useful if you are using a local server or public link)
async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

// Load and parse the CSV file
const neighborhoods = csvParse(await text("https://drive.google.com/uc?id=164frP2xYhekiQaPBFc9D2kIQosWbEfGP&export=download"), (d) => ({
  neighborhood: d.neighbourhood,
}));

// Write out CSV formatted data (assumes Node.js environment)
process.stdout.write(csvFormat(neighborhoods));

