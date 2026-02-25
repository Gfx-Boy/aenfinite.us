#!/usr/bin/env node
/**
 * generate-city-sites.js
 * 
 * Clones the aenfinite-nextjs project for each city domain and applies
 * city-specific content transformations so Google treats each as a unique,
 * locally-relevant website (not a duplicate/doorway).
 * 
 * Usage: node scripts/generate-city-sites.js [cityKey]
 *   Without args: generates all 6 city sites
 *   With arg: generates only that city (e.g., "miami")
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CITY CONFIGURATIONS
// ============================================================================

const CITY_CONFIGS = {
  miami: {
    domain: 'aenfinite.miami',
    folderName: 'aenfinite-miami',
    city: 'Miami',
    state: 'Florida',
    stateAbbr: 'FL',
    country: 'United States',
    countryCode: 'US',
    county: 'Miami-Dade County',
    postalCode: '33131',
    address: '1001 Brickell Bay Dr',
    phone: '+1 (786) 505-2890',
    phoneTel: '+17865052890',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en-US',
    nickname: 'the Magic City',
    geoLat: '25.7617',
    geoLng: '-80.1918',
    areaServed: ['Miami', 'South Florida', 'Florida', 'United States'],
    neighborhoods: ['Brickell', 'Wynwood', 'Downtown Miami', 'Coral Gables', 'Miami Beach'],
    localVerticals: ['hospitality', 'real estate', 'healthcare', 'luxury brands', 'restaurants'],
    heroTagline: 'Where Bold Ideas<br/>Meet Tropical Innovation',
    heroSubline: 'crafting digital experiences in the Magic City',
    aboutBlurb: 'Aenfinite® is a Miami-based digital innovation agency transforming businesses across South Florida and beyond. Our team delivers world-class web design, branding, and digital marketing solutions tailored to Miami\'s vibrant, multicultural market. From luxury hospitality brands in South Beach to fast-growing startups in Brickell, we partner with ambitious companies to create digital experiences that captivate audiences and accelerate growth.',
    brandingHeading: 'Miami\'s Premier Branding Excellence',
    brandingBlurb: 'Aenfinite stands as Miami\'s leading branding agency, delivering exceptional brand identities that transform businesses across South Florida and beyond. Based in the heart of the Magic City, our award-winning team combines strategic insight with innovative design to create memorable brands that drive growth.',
    footerTagline: 'Headquartered in Florida & Beyond',
    marqueeText: 'Miami-Based Digital Agency',
    metaSuffix: 'Miami',
    gaId: 'G-MIAMI000001',
  },

  nyc: {
    domain: 'aenfinite.nyc',
    folderName: 'aenfinite-nyc',
    city: 'New York',
    state: 'New York',
    stateAbbr: 'NY',
    country: 'United States',
    countryCode: 'US',
    county: 'New York County',
    postalCode: '10001',
    address: '350 Fifth Avenue',
    phone: '+1 (212) 547-8120',
    phoneTel: '+12125478120',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en-US',
    nickname: 'the City That Never Sleeps',
    geoLat: '40.7128',
    geoLng: '-74.0060',
    areaServed: ['New York City', 'New York', 'Tri-State Area', 'United States'],
    neighborhoods: ['Manhattan', 'Brooklyn', 'SoHo', 'Midtown', 'Chelsea'],
    localVerticals: ['fintech', 'fashion', 'media', 'SaaS', 'real estate'],
    heroTagline: 'Digital Innovation That<br/>Moves at NYC Speed',
    heroSubline: 'engineering next-level digital in the City That Never Sleeps',
    aboutBlurb: 'Aenfinite® is a New York City digital innovation agency building bold digital products for the world\'s most ambitious businesses. From SaaS platforms in Manhattan to fashion brands in SoHo, our team delivers enterprise-grade web design, brand identity, and digital marketing that meets the relentless pace and high standards of New York. We partner with startups and established companies alike to create impactful digital experiences that stand out in the most competitive market on earth.',
    brandingHeading: 'New York\'s Premier Branding Excellence',
    brandingBlurb: 'Aenfinite stands as New York\'s leading branding agency, delivering exceptional brand identities that transform businesses across the Tri-State Area and beyond. Based in the heart of the City That Never Sleeps, our award-winning team combines strategic insight with innovative design to create memorable brands that drive growth.',
    footerTagline: 'Headquartered in New York & Beyond',
    marqueeText: 'NYC-Based Digital Agency',
    metaSuffix: 'NYC',
    gaId: 'G-NYC0000001',
  },

  us: {
    domain: 'aenfinite.us',
    folderName: 'aenfinite-us',
    city: 'United States',
    state: '',
    stateAbbr: '',
    country: 'United States',
    countryCode: 'US',
    county: '',
    postalCode: '',
    address: '',
    phone: '+1 (303) 419-9782',
    phoneTel: '+13034199782',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en-US',
    nickname: 'coast to coast',
    geoLat: '39.8283',
    geoLng: '-98.5795',
    areaServed: ['United States', 'North America', 'Canada', 'Global'],
    neighborhoods: [],
    localVerticals: ['SaaS', 'healthcare', 'e-commerce', 'enterprise', 'startups'],
    heroTagline: 'America\'s Digital<br/>Innovation Powerhouse',
    heroSubline: 'delivering world-class digital solutions nationwide',
    aboutBlurb: 'Aenfinite® is a full-service digital innovation agency serving businesses across the United States and North America. Our distributed team of designers, developers, and strategists delivers premium web design, brand identity, UI/UX design, digital marketing, and custom development solutions to clients in every major market. From Silicon Valley startups to East Coast enterprises, we partner with growth-driven companies to build digital experiences that scale.',
    brandingHeading: 'America\'s Premier Branding Excellence',
    brandingBlurb: 'Aenfinite stands as a leading national branding agency, delivering exceptional brand identities that transform businesses across the United States and beyond. Our award-winning team combines strategic insight with innovative design to create memorable brands that drive growth.',
    footerTagline: 'Serving the United States & Beyond',
    marqueeText: 'US-Based Digital Agency',
    metaSuffix: 'US',
    gaId: 'G-US00000001',
  },

  boston: {
    domain: 'aenfinite.boston',
    folderName: 'aenfinite-boston',
    city: 'Boston',
    state: 'Massachusetts',
    stateAbbr: 'MA',
    country: 'United States',
    countryCode: 'US',
    county: 'Suffolk County',
    postalCode: '02110',
    address: '1 Federal Street',
    phone: '+1 (617) 804-3290',
    phoneTel: '+16178043290',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en-US',
    nickname: 'the Hub of Innovation',
    geoLat: '42.3601',
    geoLng: '-71.0589',
    areaServed: ['Boston', 'Massachusetts', 'New England', 'United States'],
    neighborhoods: ['Back Bay', 'Seaport', 'Cambridge', 'Beacon Hill', 'South End'],
    localVerticals: ['biotech', 'higher education', 'B2B SaaS', 'healthcare', 'fintech'],
    heroTagline: 'Innovation-Driven Digital<br/>Solutions from Boston',
    heroSubline: 'building transformative digital experiences in the Hub',
    aboutBlurb: 'Aenfinite® is a Boston-based digital innovation agency empowering businesses across New England and beyond. From biotech startups in the Seaport to established institutions in Cambridge, our team delivers precision-crafted web design, brand strategy, and digital marketing solutions that meet Boston\'s exacting standards. We combine creative excellence with technical depth to build digital products that drive measurable results in one of America\'s most intellectually demanding markets.',
    brandingHeading: 'Boston\'s Premier Branding Excellence',
    brandingBlurb: 'Aenfinite stands as Boston\'s leading branding agency, delivering exceptional brand identities that transform businesses across New England and beyond. Based in the heart of the Hub of Innovation, our award-winning team combines strategic insight with innovative design to create memorable brands that drive growth.',
    footerTagline: 'Headquartered in Massachusetts & Beyond',
    marqueeText: 'Boston-Based Digital Agency',
    metaSuffix: 'Boston',
    gaId: 'G-BOSTON00001',
  },

  melbourne: {
    domain: 'aenfinite.melbourne',
    folderName: 'aenfinite-melbourne',
    city: 'Melbourne',
    state: 'Victoria',
    stateAbbr: 'VIC',
    country: 'Australia',
    countryCode: 'AU',
    county: 'City of Melbourne',
    postalCode: '3000',
    address: '120 Collins Street',
    phone: '+61 3 9021 7450',
    phoneTel: '+61390217450',
    timezone: 'Australia/Melbourne',
    currency: 'AUD',
    language: 'en-AU',
    nickname: 'Australia\'s creative capital',
    geoLat: '-37.8136',
    geoLng: '144.9631',
    areaServed: ['Melbourne', 'Victoria', 'Australia', 'Asia-Pacific'],
    neighborhoods: ['CBD', 'South Yarra', 'Fitzroy', 'Richmond', 'St Kilda'],
    localVerticals: ['professional services', 'e-commerce', 'SaaS', 'hospitality', 'retail'],
    heroTagline: 'Award-Winning Digital<br/>Innovation from Melbourne',
    heroSubline: 'crafting world-class digital experiences in Australia\'s creative capital',
    aboutBlurb: 'Aenfinite® is a Melbourne-based digital innovation agency delivering premium design, development, and marketing solutions across Australia and the Asia-Pacific region. From established enterprises on Collins Street to fast-moving startups in Fitzroy, our team creates conversion-focused websites, distinctive brand identities, and data-driven marketing strategies that help Australian businesses compete globally. We bring a global perspective with deep local expertise to every project.',
    brandingHeading: 'Melbourne\'s Premier Branding Excellence',
    brandingBlurb: 'Aenfinite stands as Melbourne\'s leading branding agency, delivering exceptional brand identities that transform businesses across Victoria and beyond. Based in the heart of Australia\'s creative capital, our award-winning team combines strategic insight with innovative design to create memorable brands that drive growth.',
    footerTagline: 'Headquartered in Victoria & Beyond',
    marqueeText: 'Melbourne-Based Digital Agency',
    metaSuffix: 'Melbourne',
    gaId: 'G-MELB000001',
  },

  sydney: {
    domain: 'aenfinite.sydney',
    folderName: 'aenfinite-sydney',
    city: 'Sydney',
    state: 'New South Wales',
    stateAbbr: 'NSW',
    country: 'Australia',
    countryCode: 'AU',
    county: 'City of Sydney',
    postalCode: '2000',
    address: '1 Martin Place',
    phone: '+61 2 8015 6300',
    phoneTel: '+61280156300',
    timezone: 'Australia/Sydney',
    currency: 'AUD',
    language: 'en-AU',
    nickname: 'the Harbour City',
    geoLat: '-33.8688',
    geoLng: '151.2093',
    areaServed: ['Sydney', 'New South Wales', 'Australia', 'Asia-Pacific'],
    neighborhoods: ['CBD', 'Surry Hills', 'Bondi', 'Parramatta', 'North Sydney'],
    localVerticals: ['finance', 'real estate', 'hospitality', 'technology', 'healthcare'],
    heroTagline: 'Next-Level Digital<br/>Experiences from Sydney',
    heroSubline: 'building bold digital solutions in the Harbour City',
    aboutBlurb: 'Aenfinite® is a Sydney-based digital innovation agency creating exceptional digital experiences for businesses across Australia and the Asia-Pacific. From corporate headquarters at Martin Place to innovative startups in Surry Hills, our team delivers cutting-edge web design, powerful brand identities, and results-driven digital marketing strategies. We combine international expertise with local market knowledge to help Sydney businesses thrive in an increasingly digital world.',
    brandingHeading: 'Sydney\'s Premier Branding Excellence',
    brandingBlurb: 'Aenfinite stands as Sydney\'s leading branding agency, delivering exceptional brand identities that transform businesses across New South Wales and beyond. Based in the heart of the Harbour City, our award-winning team combines strategic insight with innovative design to create memorable brands that drive growth.',
    footerTagline: 'Headquartered in New South Wales & Beyond',
    marqueeText: 'Sydney-Based Digital Agency',
    metaSuffix: 'Sydney',
    gaId: 'G-SYD0000001',
  },
};

// ============================================================================
// CONTENT REPLACEMENT RULES
// ============================================================================

/**
 * Build the full set of text replacements for a given city config.
 * Order matters: more specific patterns first to avoid partial matches.
 */
function buildReplacements(cfg) {
  const replacements = [];
  const isUS = cfg.countryCode === 'US';
  const isNational = cfg.domain === 'aenfinite.us'; // No specific city

  // --- Address & location (most specific first) ---
  replacements.push(['1500 N Grant St Ste', cfg.address || '']);
  replacements.push(['1500 Grant Street', cfg.address || '']);
  replacements.push(['1500 Grant St', cfg.address || '']);

  // Full address lines
  replacements.push(['Denver, CO 80203', cfg.city && cfg.stateAbbr ? `${cfg.city}, ${cfg.stateAbbr} ${cfg.postalCode}` : '']);
  replacements.push(['Denver County, USA', cfg.county ? `${cfg.county}, ${cfg.country}` : cfg.country]);

  // Phone - all format variants
  const phoneDashed = cfg.phone.replace(/[()]/g, '').replace(/ /g, '-');
  const phoneDisplayDashed = phoneDashed.replace(/^\+/, '');

  replacements.push(['+1 (303) 419-9782', cfg.phone]);
  replacements.push(['+1 303.419.9782', cfg.phone.replace(/[() -]/g, '.').replace(/^\+/, '+')]);
  replacements.push(['tel:+13034199782', `tel:${cfg.phoneTel}`]);
  replacements.push(['+13034199782', cfg.phoneTel]);
  replacements.push(['303.419.9782', cfg.phone.replace(/^\+\d+\s*/, '').replace(/[() -]/g, '.')]);

  // JSON-LD telephone formats (various Denver numbers + placeholder)
  replacements.push(['"telephone": "+1-303-419-9782"', `"telephone": "${phoneDashed}"`]);
  replacements.push(['"telephone": "+1-720-831-1484"', `"telephone": "${phoneDashed}"`]);
  replacements.push(['"telephone": "+1234567890"', `"telephone": "${phoneDashed}"`]);
  // Visible phone display without + (e.g. "1-303-419-9782" in contact page)
  replacements.push(['1-303-419-9782', phoneDisplayDashed]);

  // Footer tagline
  replacements.push(['Headquartered in Colorado &amp; Beyond', cfg.footerTagline.replace('&', '&amp;')]);
  replacements.push(['Headquartered in Colorado & Beyond', cfg.footerTagline]);

  // --- City/state names ---
  // Specific compound phrases first
  replacements.push(['Denver-Based Digital Agency', cfg.marqueeText]);
  replacements.push(['Based in Denver and serving clients across the United States and Canada',
    isNational
      ? 'Serving clients across the United States, Canada, and worldwide'
      : `Based in ${cfg.city} and serving clients across ${cfg.areaServed.slice(0, 3).join(', ')}`
  ]);
  replacements.push(['Based in Denver', `Based in ${cfg.city}`]);
  replacements.push(['located in Mile-High City', `located in ${cfg.nickname}`]);
  replacements.push(['the Mile High City', cfg.nickname]);
  replacements.push(['the Mile-High City', cfg.nickname]);
  replacements.push(['Mile-High City', cfg.nickname]);
  replacements.push(['Mile High City', cfg.nickname]);

  // Branding page specific content
  replacements.push(["Denver's Premier Branding Excellence", cfg.brandingHeading]);
  replacements.push(["Denver's leading branding agency", `${cfg.city}'s leading branding agency`]);
  replacements.push(['across Colorado and beyond', `across ${cfg.state || cfg.country} and beyond`]);
  replacements.push(['in the heart of the Mile High City', `in the heart of ${cfg.nickname}`]);

  // Schema/structured data
  replacements.push(['"addressLocality": "Denver"', `"addressLocality": "${cfg.city}"`]);
  replacements.push(['"addressLocality":"Denver"', `"addressLocality":"${cfg.city}"`]);
  replacements.push(['"addressRegion": "CO"', `"addressRegion": "${cfg.stateAbbr}"`]);
  replacements.push(['"addressRegion":"CO"', `"addressRegion":"${cfg.stateAbbr}"`]);
  replacements.push(['"postalCode": "80203"', `"postalCode": "${cfg.postalCode}"`]);
  replacements.push(['"postalCode":"80203"', `"postalCode":"${cfg.postalCode}"`]);
  // Placeholder postal code used in service/work page schemas
  replacements.push(['"postalCode": "80202"', `"postalCode": "${cfg.postalCode}"`]);
  replacements.push(['"postalCode":"80202"', `"postalCode":"${cfg.postalCode}"`]);
  replacements.push(['"streetAddress": "1500 N Grant St Ste"', `"streetAddress": "${cfg.address}"`]);
  replacements.push(['"streetAddress":"1500 N Grant St Ste"', `"streetAddress":"${cfg.address}"`]);
  // Placeholder street address in service/work page schemas
  replacements.push(['"streetAddress": "123 Business Avenue"', `"streetAddress": "${cfg.address}"`]);
  replacements.push(['"streetAddress":"123 Business Avenue"', `"streetAddress":"${cfg.address}"`]);
  // Full address string in services index schema
  const fullAddress = [cfg.address, cfg.city, cfg.stateAbbr ? `${cfg.stateAbbr} ${cfg.postalCode}` : cfg.postalCode].filter(Boolean).join(', ').trim();
  replacements.push(['"1500 N Grant St Ste, Denver, CO 80203"', `"${fullAddress}"`]);
  replacements.push(['"areaServed": ["Denver", "Colorado", "United States", "Global"]',
    `"areaServed": ${JSON.stringify(cfg.areaServed)}`]);
  replacements.push(["areaServed", null]); // Handled by specific pattern above

  // Geo coordinates (Denver → city)
  replacements.push(['"latitude": 39.7392', `"latitude": ${cfg.geoLat}`]);
  replacements.push(['"longitude": -104.9903', `"longitude": ${cfg.geoLng}`]);
  replacements.push(['"latitude":39.7392', `"latitude":${cfg.geoLat}`]);
  replacements.push(['"longitude":-104.9903', `"longitude":${cfg.geoLng}`]);

  // Country code (for non-US sites like AU)
  if (cfg.countryCode !== 'US') {
    replacements.push(['"addressCountry": "US"', `"addressCountry": "${cfg.countryCode}"`]);
    replacements.push(['"addressCountry":"US"', `"addressCountry":"${cfg.countryCode}"`]);
  }

  // General city/state replacements (case-sensitive to avoid breaking CSS/code)
  replacements.push(["Denver, Colorado", `${cfg.city}${cfg.state ? ', ' + cfg.state : ''}`]);
  replacements.push(["Denver, CO", `${cfg.city}${cfg.stateAbbr ? ', ' + cfg.stateAbbr : ''}`]);

  // Service-specific SEO keywords (in meta keywords)
  replacements.push(['digital marketing agency Denver', `digital marketing agency ${cfg.city}`]);
  replacements.push(['Denver web agency', `${cfg.city} web agency`]);
  replacements.push(['Denver web developers', `${cfg.city} web developers`]);
  replacements.push(['Denver web design', `${cfg.city} web design`]);

  // Domain
  replacements.push(['aenfinite.com', cfg.domain]);

  // General "Denver" and "Colorado" — these go last as catch-all
  // But we need to be careful not to break "Denver City FC" (project name)
  // so we skip those specific phrases
  
  return replacements.filter(r => r[1] !== null);
}

/**
 * Apply text replacements to file content.
 * Handles both exact string matches.
 */
function applyReplacements(content, replacements) {
  let result = content;
  for (const [oldText, newText] of replacements) {
    if (oldText && newText !== undefined) {
      // Use split/join for global replacement (faster than regex for literals)
      result = result.split(oldText).join(newText);
    }
  }
  return result;
}

/**
 * Apply city-specific keyword replacements to the SEO_ENHANCEMENTS in convert-pages-v2.js
 */
function transformConversionScript(content, cfg) {
  // Replace Denver/Colorado in keyword strings
  let result = content;
  result = result.replace(/digital marketing agency Denver/g, `digital marketing agency ${cfg.city}`);
  result = result.replace(/Denver web agency contact/g, `${cfg.city} web agency contact`);
  result = result.replace(/Denver web/g, `${cfg.city} web`);
  result = result.replace(/design agency Denver/g, `design agency ${cfg.city}`);
  result = result.replace(/'Denver'/g, `'${cfg.city}'`);
  result = result.replace(/addressLocality: 'Denver'/g, `addressLocality: '${cfg.city}'`);
  result = result.replace(/addressRegion: 'CO'/g, `addressRegion: '${cfg.stateAbbr || ''}'`);
  result = result.replace(/postalCode: '80203'/g, `postalCode: '${cfg.postalCode}'`);
  result = result.replace(/postalCode: '80202'/g, `postalCode: '${cfg.postalCode}'`);
  result = result.replace(/streetAddress: '123 Business Avenue'/g, `streetAddress: '${cfg.address}'`);
  result = result.replace(/streetAddress: '1500 N Grant St Ste'/g, `streetAddress: '${cfg.address}'`);
  result = result.replace(/telephone: '\+1234567890'/g, `telephone: '${cfg.phone.replace(/[()]/g, '').replace(/ /g, '-')}'`);
  result = result.replace(/latitude: 39\.7392/g, `latitude: ${cfg.geoLat}`);
  result = result.replace(/longitude: -104\.9903/g, `longitude: ${cfg.geoLng}`);
  if (cfg.countryCode !== 'US') {
    result = result.replace(/addressCountry: 'US'/g, `addressCountry: '${cfg.countryCode}'`);
  }
  result = result.replace(/Denver, Colorado/g, `${cfg.city}${cfg.state ? ', ' + cfg.state : ''}`);
  result = result.replace(/aenfinite\.com/g, cfg.domain);
  return result;
}

/**
 * Transform the layout.tsx for a city site
 */
function transformLayout(content, cfg) {
  let result = content;

  // Domain
  result = result.replace(/aenfinite\.com/g, cfg.domain);

  // GA tracking ID
  result = result.replace(/G-K9VRBCFE61/g, cfg.gaId);

  // Language (use full code e.g. en-AU for Australian sites)
  result = result.replace(/lang="en"/g, `lang="${cfg.language}"`);

  // Site name in metadata
  result = result.replace(
    /description: 'Aenfinite® is a professional digital innovation agency specializing in[^']*'/,
    `description: 'Aenfinite® is a professional digital innovation agency in ${cfg.city} specializing in custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions.'`
  );

  return result;
}

/**
 * Transform the next.config.ts for a city site
 */
function transformConfig(content, cfg) {
  let result = content;
  result = result.replace(/aenfinite\.com/g, cfg.domain);
  return result;
}

/**
 * Transform sitemap XML files
 */
function transformSitemap(content, cfg) {
  let result = content;
  result = result.replace(/https:\/\/aenfinite\.com/g, `https://${cfg.domain}`);
  return result;
}

/**
 * Apply a final pass of general Denver/Colorado replacements that are safe
 * (within page content strings, not in code/CSS)
 */
function applyGeneralCityReplacements(content, cfg) {
  let result = content;

  // Replace remaining "Denver" that appear in content strings (inside backtick template literals)
  // Be careful: "Denver City FC" and similar project names should stay
  
  // Replace "Denver" in common page content patterns
  // Schema areaServed
  result = result.replace(/"areaServed"\s*:\s*"Denver,?\s*Colorado"/g,
    `"areaServed": "${cfg.city}${cfg.state ? ', ' + cfg.state : ''}"`);
  result = result.replace(/"areaServed"\s*:\s*"Denver"/g,
    `"areaServed": "${cfg.city}"`);

  // Meta descriptions containing Denver
  result = result.replace(/in Denver\./g, `in ${cfg.city}.`);
  result = result.replace(/in Denver,/g, `in ${cfg.city},`);
  result = result.replace(/in Denver\b(?!')/g, `in ${cfg.city}`);

  // "Denver's" possessive
  result = result.replace(/Denver's/g, `${cfg.city}'s`);
  result = result.replace(/Denver&#8217;s/g, `${cfg.city}&#8217;s`);
  
  // "Denver" standalone in keywords
  result = result.replace(/Denver web/gi, `${cfg.city} web`);
  result = result.replace(/Denver digital/gi, `${cfg.city} digital`);
  result = result.replace(/Denver branding/gi, `${cfg.city} branding`);
  result = result.replace(/Denver design/gi, `${cfg.city} design`);
  result = result.replace(/Denver UI/gi, `${cfg.city} UI`);
  result = result.replace(/Denver SEO/gi, `${cfg.city} SEO`);
  result = result.replace(/Denver PPC/gi, `${cfg.city} PPC`);
  result = result.replace(/Denver app/gi, `${cfg.city} app`);
  result = result.replace(/Denver e-commerce/gi, `${cfg.city} e-commerce`);
  result = result.replace(/Denver marketing/gi, `${cfg.city} marketing`);
  result = result.replace(/Denver graphic/gi, `${cfg.city} graphic`);
  result = result.replace(/Denver custom/gi, `${cfg.city} custom`);
  result = result.replace(/Denver software/gi, `${cfg.city} software`);
  result = result.replace(/Denver logo/gi, `${cfg.city} logo`);
  result = result.replace(/Denver packaging/gi, `${cfg.city} packaging`);

  // Colorado → state (only in content, not in "Denver, Colorado" which was already handled)
  if (cfg.state) {
    result = result.replace(/across Colorado/g, `across ${cfg.state}`);
    result = result.replace(/in Colorado/g, `in ${cfg.state}`);
  }

  // Final catch-all: any remaining standalone "Denver" (except "Denver City FC" project names)
  // This catches patterns like "for Aenfinite - Denver" in meta descriptions
  result = result.replace(/(?<![\w])Denver(?! City FC| FC | City Football)(?![\w])/g, cfg.city);

  return result;
}


// ============================================================================
// HOMEPAGE SPECIAL TRANSFORMATIONS
// ============================================================================

function transformHomepage(content, cfg) {
  let result = content;

  // Hero tagline
  result = result.replace(
    /<span>Digital innovation agency,<\/span>/,
    `<span>${cfg.heroTagline.split('<br/>')[0]},</span>`
  );
  result = result.replace(
    /<span>located in Mile-High City<\/span>/,
    `<span>${cfg.heroSubline}</span>`
  );

  // About blurb
  const aboutRegex = /<div class="textbox-content">Aenfinite® is a professional digital innovation agency that transforms businesses[^<]*<\/div>/;
  if (aboutRegex.test(result)) {
    result = result.replace(aboutRegex,
      `<div class="textbox-content">${cfg.aboutBlurb}</div>`
    );
  }

  return result;
}

/**
 * Transform the darkmode page
 */
function transformDarkmodePage(content, cfg) {
  let result = content;

  // Darkmode hero - "Shaping Digital Futures from the Mile-High City"
  result = result.replace(
    /Shaping Digital Futures\s*<br\s*\/?>\s*from\s+the Mile-High City/gi,
    `Shaping Digital Futures<br/>from ${cfg.nickname}`
  );
  result = result.replace(
    /from\s+the Mile-High City/gi,
    `from ${cfg.nickname}`
  );

  return result;
}

// ============================================================================
// FILE COPY UTILITY
// ============================================================================

/**
 * Recursively copy directory, excluding node_modules, .next, .git
 */
function copyDirSync(src, dest, excludeDirs = ['node_modules', '.next', '.git']) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) continue;
      copyDirSync(srcPath, destPath, excludeDirs);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

function generateCitySite(cityKey) {
  const cfg = CITY_CONFIGS[cityKey];
  if (!cfg) {
    console.error(`Unknown city key: ${cityKey}`);
    return false;
  }

  const sourceDir = path.resolve(__dirname, '..');
  const targetDir = path.resolve(sourceDir, '..', cfg.folderName);
  const replacements = buildReplacements(cfg);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`  Generating: ${cfg.domain} → ${cfg.folderName}`);
  console.log(`  City: ${cfg.city}${cfg.state ? ', ' + cfg.state : ''}, ${cfg.country}`);
  console.log(`${'='.repeat(70)}`);

  // Step 1: Copy project
  console.log(`\n[1/6] Copying project to ${path.basename(targetDir)}...`);
  if (fs.existsSync(targetDir)) {
    console.log(`  Removing existing directory...`);
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  copyDirSync(sourceDir, targetDir);
  console.log(`  ✓ Project copied`);

  // Step 2: Transform all page.tsx files
  console.log(`\n[2/6] Transforming page.tsx files...`);
  const appDir = path.join(targetDir, 'app');
  let pageCount = 0;
  let replacementCount = 0;

  function processPageFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        processPageFiles(fullPath);
      } else if (entry.name === 'page.tsx') {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalLength = content.length;

        // Apply standard replacements
        content = applyReplacements(content, replacements);

        // Apply general city replacements
        content = applyGeneralCityReplacements(content, cfg);

        // Special transformations for specific pages
        const relPath = path.relative(appDir, dir).replace(/\\/g, '/');
        
        if (relPath === '' || relPath === '(pages)') {
          // Homepage
          content = transformHomepage(content, cfg);
        } else if (relPath === 'darkmode') {
          content = transformDarkmodePage(content, cfg);
        }

        if (content.length !== originalLength || content !== fs.readFileSync(fullPath, 'utf8')) {
          fs.writeFileSync(fullPath, content);
          replacementCount++;
        }
        pageCount++;
      }
    }
  }

  processPageFiles(appDir);
  console.log(`  ✓ Processed ${pageCount} pages, ${replacementCount} modified`);

  // Step 3: Transform layout.tsx
  console.log(`\n[3/6] Transforming layout.tsx...`);
  const layoutPath = path.join(targetDir, 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');
    layoutContent = transformLayout(layoutContent, cfg);
    layoutContent = applyReplacements(layoutContent, replacements);
    fs.writeFileSync(layoutPath, layoutContent);
    console.log(`  ✓ layout.tsx updated`);
  }

  // Step 4: Transform next.config.ts
  console.log(`\n[4/6] Transforming next.config.ts...`);
  const configPath = path.join(targetDir, 'next.config.ts');
  if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, 'utf8');
    configContent = transformConfig(configContent, cfg);
    fs.writeFileSync(configPath, configContent);
    console.log(`  ✓ next.config.ts updated`);
  }

  // Step 5: Transform sitemaps
  console.log(`\n[5/6] Transforming sitemaps...`);
  const publicDir = path.join(targetDir, 'public');
  let sitemapCount = 0;
  if (fs.existsSync(publicDir)) {
    const publicFiles = fs.readdirSync(publicDir);
    for (const file of publicFiles) {
      if (file.endsWith('.xml')) {
        const xmlPath = path.join(publicDir, file);
        let xmlContent = fs.readFileSync(xmlPath, 'utf8');
        xmlContent = transformSitemap(xmlContent, cfg);
        fs.writeFileSync(xmlPath, xmlContent);
        sitemapCount++;
      }
    }
  }
  console.log(`  ✓ ${sitemapCount} sitemap files updated`);

  // Step 6: Transform conversion script (for future re-runs)
  console.log(`\n[6/6] Transforming scripts/convert-pages-v2.js...`);
  const scriptPath = path.join(targetDir, 'scripts', 'convert-pages-v2.js');
  if (fs.existsSync(scriptPath)) {
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    scriptContent = transformConversionScript(scriptContent, cfg);
    fs.writeFileSync(scriptPath, scriptContent);
    console.log(`  ✓ convert-pages-v2.js updated`);
  }

  // Update package.json name
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.name = cfg.folderName;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`  ✓ package.json name → ${cfg.folderName}`);
  }

  // Update robots.txt
  const robotsPath = path.join(targetDir, 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    let robotsContent = fs.readFileSync(robotsPath, 'utf8');
    robotsContent = robotsContent.replace(/aenfinite\.com/g, cfg.domain);
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`  ✓ robots.txt updated`);
  }

  // Update site.webmanifest
  const manifestPath = path.join(targetDir, 'public', 'site.webmanifest');
  if (fs.existsSync(manifestPath)) {
    let manifestContent = fs.readFileSync(manifestPath, 'utf8');
    manifestContent = manifestContent.replace(/aenfinite\.com/g, cfg.domain);
    fs.writeFileSync(manifestPath, manifestContent);
  }

  console.log(`\n  ✅ ${cfg.domain} generated successfully!`);
  console.log(`  📁 Location: ${targetDir}`);
  
  return true;
}

/**
 * Verify a generated site by counting replacements
 */
function verifySite(cityKey) {
  const cfg = CITY_CONFIGS[cityKey];
  const targetDir = path.resolve(__dirname, '..', '..', cfg.folderName);

  if (!fs.existsSync(targetDir)) {
    console.log(`  ❌ ${cfg.folderName} not found`);
    return false;
  }

  // Check for remaining "Denver" references (excluding project names like "Denver City FC")
  let denverCount = 0;
  let checkedFiles = 0;

  function checkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.next', '.git', 'public'].includes(entry.name)) continue;
        checkDir(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
        if (entry.name === 'generate-city-sites.js') continue;
        const content = fs.readFileSync(fullPath, 'utf8');
        // Count Denver occurrences that aren't part of project names
        const matches = content.match(/Denver(?! City FC| FC )/g);
        if (matches) {
          denverCount += matches.length;
          if (matches.length > 0) {
            const relPath = path.relative(targetDir, fullPath);
            // Only report if significant
            if (matches.length > 2) {
              console.log(`    ⚠️  ${relPath}: ${matches.length} remaining "Denver" references`);
            }
          }
        }
        checkedFiles++;
      }
    }
  }

  checkDir(path.join(targetDir, 'app'));
  checkDir(path.join(targetDir, 'scripts'));

  const domainCheck = fs.readFileSync(path.join(targetDir, 'app', 'layout.tsx'), 'utf8');
  const hasDomain = domainCheck.includes(cfg.domain);

  console.log(`  ${cfg.domain}: ${checkedFiles} files checked, ${denverCount} residual "Denver" refs, domain=${hasDomain ? '✓' : '✗'}`);
  return denverCount < 10; // Allow a few for project names
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

const args = process.argv.slice(2);
const startTime = Date.now();

if (args.length > 0 && args[0] !== '--verify') {
  // Generate specific city
  const cityKey = args[0].toLowerCase();
  if (!CITY_CONFIGS[cityKey]) {
    console.error(`Unknown city: ${cityKey}. Available: ${Object.keys(CITY_CONFIGS).join(', ')}`);
    process.exit(1);
  }
  generateCitySite(cityKey);
} else if (args[0] === '--verify') {
  // Verify all sites
  console.log('\nVerifying all city sites...\n');
  for (const key of Object.keys(CITY_CONFIGS)) {
    verifySite(key);
  }
} else {
  // Generate all cities
  console.log(`\n🏙️  Aenfinite City Site Generator`);
  console.log(`   Generating ${Object.keys(CITY_CONFIGS).length} city sites...\n`);

  let success = 0;
  let failed = 0;

  for (const key of Object.keys(CITY_CONFIGS)) {
    try {
      if (generateCitySite(key)) success++;
      else failed++;
    } catch (err) {
      console.error(`  ❌ Error generating ${key}:`, err.message);
      failed++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  COMPLETE: ${success} succeeded, ${failed} failed (${elapsed}s)`);
  console.log(`${'='.repeat(70)}\n`);

  // Verify
  console.log('Running verification...\n');
  for (const key of Object.keys(CITY_CONFIGS)) {
    verifySite(key);
  }
}
