/**
 * Sitemap Fixer Script
 * 
 * Fixes:
 * 1. Escape unescaped & characters to &amp; in XML
 * 2. Fix case-sensitive URLs (Pay-per-click → pay-per-click, Custom-Web-Development → custom-web-development, etc.)
 * 3. Fix old city URLs missing /cities/ prefix
 * 4. Remove known 404 URLs that don't exist (social-media-design, print-design, video-production, etc.)
 * 5. Fix uppercase work project URLs (Ansu → ansu, Cimeo-Vision → cimeo-vision, etc.)
 * 6. Remove duplicate entries
 * 7. Fix /industries/ URL (doesn't exist)
 * 8. Fix /Cities/ to /cities/ (case)
 * 9. Update website-design → web-design
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');

// URLs known to 404 (no corresponding pages exist)
const REMOVE_URLS = [
  'services/social-media-design/',
  'services/print-design/',
  'services/video-production/',
  'services/motion-graphics/',
  'services/photography/',
  'services/3d-design/',
  'industries/',
  'work/agencies/',
  'work/agencies/page/2/',
  'work/agencies/page/3/',
];

// URL case/path corrections: old → new
const URL_FIXES = {
  'services/Pay-per-click/': 'services/pay-per-click/',
  'services/Custom-Web-Development/': 'services/custom-web-development/',
  'services/website-design/': 'services/web-design/',
  'services/ai-chatbots-&-virtual-assistants/': 'services/ai-chatbots-and-virtual-assistants/',
  'services/software-&-platform-development/': 'services/software-and-platform-development/',
  'services/workflow-&-business-automation/': 'services/workflow-and-business-automation/',
  'work/web-design-&-development/': 'work/web-design-and-development/',
  'work/Ansu/': 'work/ansu/',
  'work/Cimeo-Vision/': 'work/cimeo-vision/',
  'work/Fiscoclic/': 'work/fiscoclic/',
  'work/Global-Design-Solution/': 'work/global-design-solution/',
  'work/Husnohaya/': 'work/husnohaya/',
  'work/Neocert/': 'work/neocert/',
  'work/Neurolinker/': 'work/neurolinker/',
  'work/Olly/': 'work/olly/',
  'work/RoboPhil/': 'work/robophil/',
  'Cities/': 'cities/',
  // City URLs: old format was /los-angeles-ca/..., new is /cities/los-angeles-ca/...
};

function fixSitemap(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  let changes = 0;

  // 1. Fix unescaped & in URLs (but not &amp; which is already escaped)
  // In XML <loc> tags, & must be &amp;
  // Actually, we're replacing & URLs with clean "and" URLs, so we handle it via URL_FIXES
  // But also fix any stray & in comments
  content = content.replace(/<!-- ([^>]*?)&([^>]*?) -->/g, (match, p1, p2) => {
    changes++;
    return `<!-- ${p1}&amp;${p2} -->`;
  });

  // 2. Remove 404 URLs
  for (const badUrl of REMOVE_URLS) {
    const regex = new RegExp(
      `\\s*<url>\\s*<loc>https?://aenfinite\\.com/${badUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[\\s\\S]*?</url>`,
      'g'
    );
    const before = content;
    content = content.replace(regex, '');
    if (content !== before) {
      changes++;
      console.log(`  Removed 404: ${badUrl}`);
    }
  }

  // 3. Fix URL paths
  for (const [oldPath, newPath] of Object.entries(URL_FIXES)) {
    const escapedOld = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(<loc>https?://aenfinite\\.com/)${escapedOld}(</loc>)`,
      'g'
    );
    const before = content;
    content = content.replace(regex, `$1${newPath}$2`);
    if (content !== before) {
      changes++;
      console.log(`  Fixed URL: ${oldPath} → ${newPath}`);
    }
  }

  // 4. Fix any remaining unescaped & in <loc> tags
  content = content.replace(/<loc>([^<]*)<\/loc>/g, (match, url) => {
    const fixed = url.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;');
    if (fixed !== url) {
      changes++;
      console.log(`  Escaped & in: ${url}`);
    }
    return `<loc>${fixed}</loc>`;
  });

  // 5. Fix old city URLs missing /cities/ prefix
  // Pattern: /los-angeles-ca/... → /cities/los-angeles-ca/...
  content = content.replace(
    /<loc>(https?:\/\/aenfinite\.com)\/((?:los-angeles|san-diego|san-jose|san-francisco|fresno|sacramento|long-beach|oakland|bakersfield|anaheim|santa-ana|riverside|stockton|irvine|chula-vista|fremont|san-bernardino|moreno-valley|fontana|modesto|glendale|huntington-beach|santa-clarita|garden-grove|oceanside|rancho-cucamonga|ontario|santa-rosa|elk-grove|corona|lancaster|palmdale|salinas|pomona|hayward|escondido|sunnyvale|torrance|pasadena|orange|fullerton|thousand-oaks|roseville|concord|simi-valley|santa-clara|victorville|vallejo|berkeley|el-monte|downey|costa-mesa|inglewood|carlsbad|san-buenaventura|fairfield|west-covina|murrieta|richmond|norwalk|antioch|temecula|burbank|daly-city|el-cajon|san-mateo|clovis|compton|jurupa-valley|vista|south-gate|mission-viejo|vacaville|carson|hesperia|santa-maria|redding|westminster|santa-barbara|chico|newport-beach|san-leandro|san-marcos|whittier|hawthorne|citrus-heights|alhambra|tracy|livermore|buena-park|menifee|hemet|lakewood|merced|chino|indio|redwood-city|lake-forest|napa|tustin|bellflower|mountain-view|chino-hills|baldwin-park|alameda|upland|san-ramon|folsom|pleasanton|lynwood|union-city|apple-valley|turlock|perris|manteca|milpitas|redlands|brentwood|la-habra|gilroy|dublin|yuba-city|lodi|porterville|woodland|hanford|tulare|madera|palo-alto|lompoc|delano|petaluma|novato|hollister|watsonville|dinuba|calexico|healdsburg|cloverdale|new-york|houston|phoenix|philadelphia|san-antonio|dallas|jacksonville|indianapolis|columbus|charlotte|austin|fort-worth|denver|el-paso|nashville|seattle|washington|boston|detroit|memphis|portland|oklahoma-city|las-vegas|louisville|baltimore|milwaukee|albuquerque|tucson|mesa|virginia-beach|omaha|colorado-springs|raleigh|miami|minneapolis|tulsa|tampa|arlington|new-orleans|cleveland|bakersfield|aurora|honolulu|anaheim|santa-ana|corpus-christi|riverside|lexington|stockton|pittsburgh|saint-paul|anchorage|cincinnati|henderson|greensboro|plano|newark|lincoln|orlando|jersey-city|chandler|st-louis|north-las-vegas|norfolk|durham|madison|lubbock|winston-salem|garland|baton-rouge|reno|glendale|hialeah|chesapeake|scottsdale|irving|gilbert|laredo|chula-vista|fremont|irvine|boise|richmond|spokane|tacoma|des-moines|montgomery|fayetteville|shreveport|akron|little-rock|mobile|knoxville|amarillo|huntsville|augusta|grand-rapids|salt-lake-city|tallahassee|worcester|overland-park|port-st-lucie|tempe|brownsville|chattanooga|cape-coral|sioux-falls|peoria|mcallen|lakeland|columbia|clarksville|macon|springfield|fort-lauderdale|topeka|savannah|paterson|joliet|bridgeport|bellevue|cary|naperville|charleston|surprise|dayton|mckinney|olathe|waco|roseville|thornton|miramar|pasadena|pompano-beach|eugene|salem|pembroke-pines|denton|garden-grove|new-haven|west-valley-city|cedar-rapids|midland|coral-springs|centennial|clearwater|lewisville|west-jordan|manchester|round-rock|sterling-heights|arvada|provo|tyler|frisco|green-bay|killeen|visalia|independence|pueblo|murfreesboro|allen|palm-bay|fargo|wilmington|carrollton|athens|beaumont|odessa|evansville|high-point|wichita-falls|concord|hartford|abilene|gainesville|pearland|college-station|richardson|lee-summit|league-city|berkeley|broken-arrow|elgin|palmdale|wyoming|edinburg|lakewood|sandy-springs|daytona-beach|jurupa-valley|hampton|davie|largo|longmont|deerfield-beach|sugar-land|temecula|west-palm-beach|meridian)-(?:ca|tx|ny|fl|oh|pa|il|az|tn|mi|ga|nc|in|nj|co|md|wa|va|ma|wi|mn|mo|ct|or|al|la|ky|ok|sc|ut|ar|ia|ks|ms|nv|nm|ne|wv|id|hi|nh|me|ri|mt|de|sd|nd|ak|vt|wy|dc)\/)/g,
    (match, domain, cityState) => {
      changes++;
      console.log(`  Fixed city URL: /${cityState} → /cities/${cityState}`);
      return `<loc>${domain}/cities/${cityState}`;
    }
  );

  // 6. Remove duplicate <url> entries
  const urlBlocks = [];
  const seenLocs = new Set();
  let deduped = content.replace(
    /<url>\s*<loc>(.*?)<\/loc>[\s\S]*?<\/url>/g,
    (match, loc) => {
      if (seenLocs.has(loc)) {
        changes++;
        console.log(`  Removed duplicate: ${loc}`);
        return '';
      }
      seenLocs.add(loc);
      return match;
    }
  );
  content = deduped;

  // 7. Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${fileName}: ${changes} fixes applied`);
  } else {
    console.log(`  ✅ ${fileName}: no fixes needed`);
  }
}

function main() {
  console.log('🔧 Fixing sitemaps...\n');
  
  const sitemapFiles = fs.readdirSync(PUBLIC_DIR)
    .filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));

  for (const file of sitemapFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    console.log(`Processing: ${file}`);
    fixSitemap(filePath);
    console.log('');
  }

  console.log('Done! 🎉');
}

main();
