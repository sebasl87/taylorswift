
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');
const shows = require('../src/constants/shows.json');

const OUTPUT_DIR = path.join(__dirname, '../public/images/shows');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Map Eras/Years to Search Queries for Wikimedia
const SEARCH_QUERIES = {
  'Debut Era': 'Taylor Swift 2006 2007',
  'Fearless Era': 'Taylor Swift Fearless Tour',
  'Speak Now Era': 'Taylor Swift Speak Now Tour',
  'Red Era': 'Taylor Swift Red Tour',
  '1989 Era': 'Taylor Swift 1989 World Tour',
  'Reputation Era': 'Taylor Swift Reputation Stadium Tour',
  'Lover Era': 'Taylor Swift Lover 2019',
  'Folklore Era': 'Taylor Swift Folklore Long Pond',
  'Red (TV) Era': 'Taylor Swift All Too Well SNL',
  'The Eras Tour': 'Taylor Swift The Eras Tour'
};

// Fallback map if specific era search fails or for variety
const SPECIFIC_QUERIES = {
  '2006': 'Taylor Swift 2006',
  '2007': 'Taylor Swift 2007',
  '2009': 'Taylor Swift Fearless Tour',
  '2010': 'Taylor Swift Fearless Tour 2010',
  '2011': 'Taylor Swift Speak Now Tour 2011',
  '2012': 'Taylor Swift Speak Now Tour 2012',
  '2013': 'Taylor Swift Red Tour 2013',
  '2014': 'Taylor Swift Red Tour 2014',
  '2015': 'Taylor Swift 1989 Tour 2015',
  '2016': 'Taylor Swift 2016',
  '2017': 'Taylor Swift 2017',
  '2018': 'Taylor Swift Reputation Tour',
  '2019': 'Taylor Swift 2019',
  '2020': 'Taylor Swift folklore',
  '2021': 'Taylor Swift 2021',
  '2022': 'Taylor Swift 2022',
  '2023': 'Taylor Swift Eras Tour 2023',
  '2024': 'Taylor Swift Eras Tour 2024'
};

async function getImageUrl(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.query || !data.query.pages) return null;
    const pages = Object.values(data.query.pages);
    if (pages.length > 0 && pages[0].imageinfo && pages[0].imageinfo.length > 0) {
      return pages[0].imageinfo[0].url;
    }
  } catch (e) {
    console.error(`Error searching for ${query}:`, e.message);
  }
  return null;
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAndConvert(url, outputPath, retries = 3) {
  console.log(`Downloading ${url} to ${outputPath}...`);
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TaylorSwiftBot/1.0 (sebasl87@github) - Educational Project' } }, (res) => {
      if (res.statusCode === 429 && retries > 0) {
        console.warn(`Rate limited (429). Waiting before retry...`);
        return wait(2000).then(() => downloadAndConvert(url, outputPath, retries - 1).then(resolve).catch(reject));
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await sharp(buffer)
            .resize(800, 600, { fit: 'cover', position: 'top' }) // Resize for consistency
            .webp({ quality: 80 })
            .toFile(outputPath);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

const ERA_COLORS = {
  'Debut Era': '#bbf9ba',
  'Fearless Era': '#e5c97f',
  'Speak Now Era': '#d294e6',
  'Red Era': '#a3383a',
  '1989 Era': '#a2d6e6',
  'Reputation Era': '#333333',
  'Lover Era': '#f5b0ce',
  'Folklore Era': '#cfcfcf',
  'Evermore Era': '#cc7e48',
  'Midnights Era': '#2c3e85',
  'The Eras Tour': '#ecbfce'
};

async function generatePlaceholder(outputPath, text, era) {
  console.log(`Generating placeholder for ${outputPath}...`);
  const color = ERA_COLORS[era] || '#cccccc';
  
  const svgImage = `
  <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}" />
    <text x="50%" y="50%" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dy=".3em">${text}</text>
    <text x="50%" y="60%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">${era}</text>
  </svg>
  `;

  await sharp(Buffer.from(svgImage))
    .webp()
    .toFile(outputPath);
}

async function processShows() {
  const processedUrls = new Map(); // Cache URL -> Local Path

  for (const show of shows) {
    const targetFilename = show.image.split('/').pop(); // e.g., 2006.webp
    const targetPath = path.join(OUTPUT_DIR, targetFilename);
    
    // Skip if already exists (optional, but good for speed)
    if (fs.existsSync(targetPath)) {
        console.log(`File ${targetFilename} already exists. Skipping.`);
        continue;
    }
    
    // Determine best query
    let query = SEARCH_QUERIES[show.era] || 'Taylor Swift concert';
    if (targetFilename.includes('2006')) query = 'Taylor Swift 2006';
    // ... (rest of query logic is fine, keeping simplified for brevity in thought but code will have it)
    // Actually I should keep the query logic or just rely on the existing one if I'm editing the function.
    // I will replace the whole processShows loop to integrate the fallback properly.
    
    // Refine query based on filename keywords (Same as before)
    if (targetFilename.includes('2006')) query = 'Taylor Swift 2006';
    else if (targetFilename.includes('2007')) query = 'Taylor Swift 2007';
    else if (targetFilename.includes('2009')) query = 'Taylor Swift Fearless Tour 2009';
    else if (targetFilename.includes('2010')) query = 'Taylor Swift Fearless Tour 2010';
    else if (targetFilename.includes('2011')) query = 'Taylor Swift Speak Now Tour 2011';
    else if (targetFilename.includes('2012')) query = 'Taylor Swift 2012';
    else if (targetFilename.includes('2013')) query = 'Taylor Swift Red Tour 2013';
    else if (targetFilename.includes('2014')) query = 'Taylor Swift Red Tour 2014';
    else if (targetFilename.includes('2015')) query = 'Taylor Swift 1989 Tour 2015';
    else if (targetFilename.includes('2016')) query = 'Taylor Swift 2016';
    else if (targetFilename.includes('2017')) query = 'Taylor Swift 2017';
    else if (targetFilename.includes('2018')) query = 'Taylor Swift Reputation Tour 2018';
    else if (targetFilename.includes('2019')) query = 'Taylor Swift Lover 2019';
    else if (targetFilename.includes('2020')) query = 'Taylor Swift folklore';
    else if (targetFilename.includes('2021')) query = 'Taylor Swift 2021';
    else if (targetFilename.includes('2023')) query = 'Taylor Swift Eras Tour 2023';
    else if (targetFilename.includes('2024')) query = 'Taylor Swift Eras Tour 2024';
    
    if (targetFilename.includes('snl')) query = 'Taylor Swift SNL';
    if (targetFilename.includes('tiny')) query = 'Taylor Swift NPR Tiny Desk';
    if (targetFilename.includes('longpond')) query = 'Taylor Swift Long Pond';
    if (targetFilename.includes('vma')) query = 'Taylor Swift VMA 2009';
    if (targetFilename.includes('grammy')) query = 'Taylor Swift Grammy';

    console.log(`Processing ${targetFilename} (Query: ${query})...`);

    try {
      // Check cache
      if (processedUrls.has(query)) {
        console.log(`Using cached image for ${query}`);
        fs.copyFileSync(processedUrls.get(query), targetPath);
        continue;
      }
      
      await wait(1000); 

      const imageUrl = await getImageUrl(query);
      if (imageUrl && !imageUrl.toLowerCase().endsWith('.pdf') && !imageUrl.toLowerCase().endsWith('.djvu')) {
         await downloadAndConvert(imageUrl, targetPath);
         processedUrls.set(query, targetPath);
         console.log(`Saved to ${targetPath}`);
      } else {
        throw new Error("No valid image found");
      }
    } catch (e) {
      console.warn(`Failed to download for ${targetFilename} (${e.message}). Generating placeholder.`);
      await generatePlaceholder(targetPath, show.city + ' ' + show.date.split('-')[0], show.era);
    }
  }
}

processShows().catch(console.error);
