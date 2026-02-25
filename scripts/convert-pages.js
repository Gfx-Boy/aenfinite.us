/**
 * HTML to Next.js Page Converter
 * 
 * Reads all HTML files from the original site and generates
 * Next.js App Router page components with:
 * - Server-side metadata for SEO
 * - Client-side rendering with exact same HTML/CSS/JS
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../../aenfinite-llc');
const TARGET_DIR = path.resolve(__dirname, '../app');

// All page paths to convert (relative to SOURCE_DIR)
const PAGES = [
  // Root
  { src: 'index.html', route: '(pages)' },
  
  // Services
  { src: 'services/index.html', route: 'services' },
  { src: 'services/ai-chatbots-&-virtual-assistants/index.html', route: 'services/ai-chatbots-and-virtual-assistants' },
  { src: 'services/app-development/index.html', route: 'services/app-development' },
  { src: 'services/branding/index.html', route: 'services/branding' },
  { src: 'services/conference-branding/index.html', route: 'services/conference-branding' },
  { src: 'services/custom-web-development/index.html', route: 'services/custom-web-development' },
  { src: 'services/digital-marketing/index.html', route: 'services/digital-marketing' },
  { src: 'services/e-commerce-websites/index.html', route: 'services/e-commerce-websites' },
  { src: 'services/graphic-design/index.html', route: 'services/graphic-design' },
  { src: 'services/logo-design/index.html', route: 'services/logo-design' },
  { src: 'services/packaging-design/index.html', route: 'services/packaging-design' },
  { src: 'services/paid-ads/index.html', route: 'services/paid-ads' },
  { src: 'services/pay-per-click/index.html', route: 'services/pay-per-click' },
  { src: 'services/search-engine-optimization/index.html', route: 'services/search-engine-optimization' },
  { src: 'services/social-media-marketing/index.html', route: 'services/social-media-marketing' },
  { src: 'services/software-&-platform-development/index.html', route: 'services/software-and-platform-development' },
  { src: 'services/trade-show-booth-design/index.html', route: 'services/trade-show-booth-design' },
  { src: 'services/ui-ux-design/index.html', route: 'services/ui-ux-design' },
  { src: 'services/web-design/index.html', route: 'services/web-design' },
  { src: 'services/web-design-and-branding-for-real-estate/index.html', route: 'services/web-design-and-branding-for-real-estate' },
  { src: 'services/wordpress-websites/index.html', route: 'services/wordpress-websites' },
  { src: 'services/workflow-&-business-automation/index.html', route: 'services/workflow-and-business-automation' },

  // Work / Portfolio
  { src: 'work/index.html', route: 'work' },
  { src: 'work/all/index.html', route: 'work/all' },
  { src: 'work/afropopup/index.html', route: 'work/afropopup' },
  { src: 'work/algopros/index.html', route: 'work/algopros' },
  { src: 'work/amkiservice/index.html', route: 'work/amkiservice' },
  { src: 'work/Ansu/index.html', route: 'work/ansu' },
  { src: 'work/blue-vine-marketing/index.html', route: 'work/blue-vine-marketing' },
  { src: 'work/branding/index.html', route: 'work/branding' },
  { src: 'work/cimeo-vision/index.html', route: 'work/cimeo-vision' },
  { src: 'work/feiro/index.html', route: 'work/feiro' },
  { src: 'work/fiscoclic/index.html', route: 'work/fiscoclic' },
  { src: 'work/global-design-solution/index.html', route: 'work/global-design-solution' },
  { src: 'work/graphic-design/index.html', route: 'work/graphic-design' },
  { src: 'work/husnohaya/index.html', route: 'work/husnohaya' },
  { src: 'work/khatech/index.html', route: 'work/khatech' },
  { src: 'work/logo-design/index.html', route: 'work/logo-design' },
  { src: 'work/lumea/index.html', route: 'work/lumea' },
  { src: 'work/mindfit/index.html', route: 'work/mindfit' },
  { src: 'work/mobile-apps/index.html', route: 'work/mobile-apps' },
  { src: 'work/neocert/index.html', route: 'work/neocert' },
  { src: 'work/neurolinker/index.html', route: 'work/neurolinker' },
  { src: 'work/olly/index.html', route: 'work/olly' },
  { src: 'work/packaging-design/index.html', route: 'work/packaging-design' },
  { src: 'work/quarena/index.html', route: 'work/quarena' },
  { src: 'work/robophil/index.html', route: 'work/robophil' },
  { src: 'work/web-design-&-development/index.html', route: 'work/web-design-and-development' },

  // City
  { src: 'city/index.html', route: 'city' },
  { src: 'city/ai-&-technology-solutions/index.html', route: 'city/ai-and-technology-solutions' },
  { src: 'city/design-&-creative-solutions/index.html', route: 'city/design-and-creative-solutions' },
  { src: 'city/development/index.html', route: 'city/development' },
  { src: 'city/main-hub/index.html', route: 'city/main-hub' },
  { src: 'city/marketing-&-digtal-solutions/index.html', route: 'city/marketing-and-digital-solutions' },

  // Cities
  { src: 'Cities/los-angeles-ca/ai-chatbots-virtual-assistants-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/ai-chatbots-virtual-assistants' },
  { src: 'Cities/los-angeles-ca/graphic-design-branding-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/graphic-design-branding' },
  { src: 'Cities/los-angeles-ca/software-development-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/software-development' },
  { src: 'Cities/los-angeles-ca/web-design-marketing-agency-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/web-design-marketing-agency' },
  { src: 'Cities/los-angeles-ca/web-designing-and-digital-marketing-agency-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/web-designing-and-digital-marketing-agency' },
  { src: 'Cities/san-diego-ca/web-design-marketing-agency-san-diego-ca/index.html', route: 'cities/san-diego-ca/web-design-marketing-agency' },

  // Agency
  { src: 'agency/index.html', route: 'agency' },
  { src: 'agency/partner-with-us/index.html', route: 'agency/partner-with-us' },
  { src: 'agency/partner-with-us/ghl-services/index.html', route: 'agency/partner-with-us/ghl-services' },
  { src: 'agency/partner-with-us/referral-program/index.html', route: 'agency/partner-with-us/referral-program' },
  { src: 'agency/partner-with-us/white-label-services/index.html', route: 'agency/partner-with-us/white-label-services' },

  // Other standalone pages
  { src: 'contact/index.html', route: 'contact' },
  { src: 'blog/index.html', route: 'blog' },
  { src: 'featured-work/index.html', route: 'featured-work' },
  { src: 'privacy-policy/index.html', route: 'privacy-policy' },
  { src: 'darkmode/index.html', route: 'darkmode' },
];

/**
 * Extract metadata from HTML <head>
 */
function extractMetadata(html) {
  const meta = {};
  
  // Title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  meta.title = titleMatch ? titleMatch[1].trim() : 'Aenfinite';
  
  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is);
  meta.description = descMatch ? descMatch[1].trim() : '';
  
  // Canonical URL
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/is);
  meta.canonical = canonMatch ? canonMatch[1].trim() : '';
  
  // OG tags
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/is);
  const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/is);
  const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/is);
  const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["'](.*?)["']/is);
  
  meta.openGraph = {};
  if (ogTitle) meta.openGraph.title = ogTitle[1].trim();
  if (ogDesc) meta.openGraph.description = ogDesc[1].trim();
  if (ogImage) meta.openGraph.images = [{ url: ogImage[1].trim() }];
  if (ogUrl) meta.openGraph.url = ogUrl[1].trim();
  
  // Twitter
  const twCard = html.match(/<meta\s+name=["']twitter:card["']\s+content=["'](.*?)["']/is);
  const twTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/is);
  const twDesc = html.match(/<meta\s+name=["']twitter:description["']\s+content=["'](.*?)["']/is);
  const twImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["'](.*?)["']/is);
  
  meta.twitter = {};
  if (twCard) meta.twitter.card = twCard[1].trim();
  if (twTitle) meta.twitter.title = twTitle[1].trim();
  if (twDesc) meta.twitter.description = twDesc[1].trim();
  if (twImage) meta.twitter.images = [twImage[1].trim()];
  
  // Schema.org / JSON-LD
  const schemaMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  meta.schemas = [];
  if (schemaMatches) {
    for (const sm of schemaMatches) {
      const content = sm.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (content) {
        meta.schemas.push(content[1].trim());
      }
    }
  }

  // Keywords
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/is);
  meta.keywords = keywordsMatch ? keywordsMatch[1].trim() : '';

  return meta;
}

/**
 * Extract head styles (inline <style> blocks)
 */
function extractHeadStyles(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return '';
  
  const head = headMatch[1];
  const styles = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(head)) !== null) {
    styles.push(match[1]);
  }
  return styles.join('\n');
}

/**
 * Extract head scripts (inline scripts in <head>)
 */
function extractHeadScripts(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return [];
  
  const head = headMatch[1];
  const scripts = [];
  // Match inline scripts (not src-based, not JSON-LD)
  const scriptRegex = /<script(?!\s+type=["']application\/ld\+json["'])(?!\s+[^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(head)) !== null) {
    const content = match[1].trim();
    if (content && content.length > 10) { // Skip tiny/empty scripts
      scripts.push(content);
    }
  }
  return scripts;
}

/**
 * Extract body content
 */
function extractBodyContent(html) {
  // Get everything between <body...> and </body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';
  return bodyMatch[1];
}

/**
 * Extract body class
 */
function extractBodyClass(html) {
  const bodyMatch = html.match(/<body\s+class=["'](.*?)["']/i);
  return bodyMatch ? bodyMatch[1] : '';
}

/**
 * Fix asset paths - normalize all relative paths to absolute
 */
function fixAssetPaths(html) {
  // Fix relative paths like ../wp-content, ../../wp-content etc to /wp-content
  let fixed = html.replace(/(?:\.\.\/)+wp-content\//g, '/wp-content/');
  fixed = fixed.replace(/(?:\.\.\/)+wp-includes\//g, '/wp-includes/');
  fixed = fixed.replace(/(?:\.\.\/)+js\//g, '/js/');
  fixed = fixed.replace(/(?:\.\.\/)+intro\//g, '/intro/');
  // Fix relative paths for external resources
  fixed = fixed.replace(/(?:\.\.\/)+www\.google\.com/g, 'https://www.google.com');
  fixed = fixed.replace(/(?:\.\.\/)+www\.googletagmanager\.com/g, 'https://www.googletagmanager.com');
  fixed = fixed.replace(/(?:\.\.\/)+snap\.licdn\.com/g, 'https://snap.licdn.com');
  fixed = fixed.replace(/(?:\.\.\/)+tag\.clearbitscripts\.com/g, 'https://tag.clearbitscripts.com');
  fixed = fixed.replace(/(?:\.\.\/)+acsbapp\.com/g, 'https://acsbapp.com');
  fixed = fixed.replace(/(?:\.\.\/)+cdn-cgi\//g, '/cdn-cgi/');
  // Remove paths without leading / for wp-content at start of attribute values
  fixed = fixed.replace(/((?:href|src)=['"])(?!https?:\/\/)(?!\/)wp-content/g, '$1/wp-content');
  fixed = fixed.replace(/((?:href|src)=['"])(?!https?:\/\/)(?!\/)wp-includes/g, '$1/wp-includes');
  return fixed;
}

/**
 * Escape content for template literals
 */
function escapeForTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/**
 * Generate Next.js page component
 */
function generatePage(pageDef, html) {
  const meta = extractMetadata(html);
  const headStyles = extractHeadStyles(html);
  const headScripts = extractHeadScripts(html);
  const bodyContent = extractBodyContent(html);
  const bodyClass = extractBodyClass(html);
  const fixedContent = fixAssetPaths(bodyContent);
  const fixedStyles = fixAssetPaths(headStyles);
  
  // Build metadata export
  const metadataLines = [];
  metadataLines.push(`  title: ${JSON.stringify(meta.title)},`);
  if (meta.description) metadataLines.push(`  description: ${JSON.stringify(meta.description)},`);
  if (meta.keywords) metadataLines.push(`  keywords: ${JSON.stringify(meta.keywords)},`);
  if (meta.canonical) {
    metadataLines.push(`  alternates: { canonical: ${JSON.stringify(meta.canonical)} },`);
  }
  if (meta.openGraph && Object.keys(meta.openGraph).length > 0) {
    metadataLines.push(`  openGraph: ${JSON.stringify(meta.openGraph)},`);
  }
  if (meta.twitter && Object.keys(meta.twitter).length > 0) {
    metadataLines.push(`  twitter: ${JSON.stringify(meta.twitter)},`);
  }
  metadataLines.push(`  robots: { index: true, follow: true },`);

  // Build JSON-LD scripts
  let jsonLdSection = '';
  if (meta.schemas.length > 0) {
    const schemaScripts = meta.schemas.map((s, i) => {
      return `        <script
          key="schema-${i}"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: \`${escapeForTemplate(s)}\` }}
        />`;
    }).join('\n');
    jsonLdSection = schemaScripts;
  }

  // Fix head scripts - combine them
  const combinedHeadScripts = headScripts.join('\n\n');

  const isHomepage = pageDef.route === '(pages)';
  
  // Generate the page.tsx content
  const pageContent = `import type { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';

export const metadata: Metadata = {
${metadataLines.join('\n')}
};

const headStyles = \`${escapeForTemplate(fixedStyles)}\`;

const bodyClass = ${JSON.stringify(bodyClass)};

const pageContent = \`${escapeForTemplate(fixedContent)}\`;

const headScripts = \`${escapeForTemplate(combinedHeadScripts)}\`;

export default function Page() {
  return (
    <>
${jsonLdSection ? jsonLdSection : '      {/* No JSON-LD for this page */}'}
      <PageRenderer 
        content={pageContent} 
        headStyles={headStyles}
        headScripts={headScripts}
        bodyClass={bodyClass}
      />
    </>
  );
}
`;

  return pageContent;
}

/**
 * Main conversion function
 */
function main() {
  console.log('🚀 Starting HTML to Next.js conversion...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const pageDef of PAGES) {
    const srcPath = path.join(SOURCE_DIR, pageDef.src);
    
    if (!fs.existsSync(srcPath)) {
      console.log(`⚠️  Skipping (not found): ${pageDef.src}`);
      errors.push({ src: pageDef.src, error: 'File not found' });
      errorCount++;
      continue;
    }

    try {
      const html = fs.readFileSync(srcPath, 'utf-8');
      const pageContent = generatePage(pageDef, html);
      
      // Determine output directory
      let outputDir;
      if (pageDef.route === '(pages)') {
        outputDir = TARGET_DIR; // Root page goes to app/
      } else {
        outputDir = path.join(TARGET_DIR, pageDef.route);
      }
      
      fs.mkdirSync(outputDir, { recursive: true });
      
      const outputFile = path.join(outputDir, 'page.tsx');
      fs.writeFileSync(outputFile, pageContent, 'utf-8');
      
      console.log(`✅ ${pageDef.route.padEnd(60)} → ${path.relative(TARGET_DIR, outputFile)}`);
      successCount++;
    } catch (err) {
      console.log(`❌ Error processing ${pageDef.src}: ${err.message}`);
      errors.push({ src: pageDef.src, error: err.message });
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Successfully converted: ${successCount} pages`);
  console.log(`❌ Errors: ${errorCount} pages`);
  
  if (errors.length > 0) {
    console.log('\nFailed pages:');
    errors.forEach(e => console.log(`  - ${e.src}: ${e.error}`));
  }
  
  console.log('\nDone! 🎉');
}

main();
