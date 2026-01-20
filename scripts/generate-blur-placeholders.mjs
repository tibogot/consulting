import { getPlaiceholder } from "plaiceholder";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { name: "alev-takil", path: "public/alev-takil.jpg" },
  { name: "channel-82", path: "public/channel-82.jpg" },
  { name: "campaign-creators", path: "public/campaign-creators.jpg" },
  { name: "charlesdeluvio", path: "public/images/cards/charlesdeluvio.jpg" },
  { name: "clay", path: "public/images/cards/clay.jpg" },
  { name: "malte", path: "public/images/cards/malte.jpg" },
];

async function generateBlurPlaceholders() {
  const results = {};

  for (const img of images) {
    const imagePath = path.join(__dirname, "..", img.path);
    const buffer = await fs.readFile(imagePath);
    const { base64 } = await getPlaiceholder(buffer);
    results[img.name] = base64;
    console.log(`✓ Generated blur placeholder for ${img.name}`);
  }

  // Write to a JSON file
  const outputPath = path.join(__dirname, "..", "lib", "blur-placeholders.json");
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✓ Saved blur placeholders to lib/blur-placeholders.json`);
}

generateBlurPlaceholders().catch(console.error);
