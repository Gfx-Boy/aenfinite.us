#!/usr/bin/env node
/**
 * optimize-images.js
 * 
 * Converts all JPG/JPEG/PNG images to WebP format for massive file size reduction.
 * Creates WebP files alongside originals (so existing HTML references still work
 * if .webp isn't served). Then updates all page.tsx files to reference .webp.
 * 
 * Also resizes oversized images (>1920px wide) to max 1920px.
 * 
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const APP_DIR = path.join(__dirname, '..', 'app');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80; // Good balance of quality vs size

let stats = {
  totalImages: 0,
  converted: 0,
  skipped: 0,
  failed: 0,
  originalSize: 0,
  newSize: 0,
};

/**
 * Recursively find all image files
 */
function findImages(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      findImages(fullPath, results);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/**
 * Convert a single image to WebP
 */
async function convertToWebp(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  
  // Skip if WebP already exists and is newer than original
  if (fs.existsSync(webpPath)) {
    const origStat = fs.statSync(imagePath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs > origStat.mtimeMs) {
      stats.skipped++;
      return webpPath;
    }
  }

  try {
    const originalSize = fs.statSync(imagePath).size;
    stats.originalSize += originalSize;

    let pipeline = sharp(imagePath);
    
    // Get metadata to check dimensions
    const metadata = await pipeline.metadata();
    
    // Resize if wider than MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Convert to WebP
    await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(webpPath);

    const newSize = fs.statSync(webpPath).size;
    stats.newSize += newSize;
    stats.converted++;

    const savings = ((1 - newSize / originalSize) * 100).toFixed(0);
    const relPath = path.relative(PUBLIC_DIR, imagePath);
    if (originalSize > 500 * 1024) { // Only log large files
      console.log(`  ✓ ${relPath} ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (${savings}% smaller)`);
    }

    return webpPath;
  } catch (err) {
    console.error(`  ✗ Failed: ${path.relative(PUBLIC_DIR, imagePath)}: ${err.message}`);
    stats.failed++;
    return null;
  }
}

/**
 * Update all page.tsx files to use .webp extensions for images
 */
function updatePageReferences() {
  let filesUpdated = 0;
  let refsUpdated = 0;

  function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
        processDir(fullPath);
      } else if (entry.name === 'page.tsx') {
        let content = fs.readFileSync(fullPath, 'utf8');
        const original = content;

        // Replace image references in src attributes and CSS url()
        // Match paths like /wp-content/.../image.jpg, /wp-content/.../image.png etc.
        content = content.replace(
          /((?:src|href|srcSet|poster)=["'](?:[^"']*?))(\.(?:jpg|jpeg|png))(["'])/gi,
          (match, prefix, ext, suffix) => {
            // Don't replace external URLs
            if (prefix.includes('http://') || prefix.includes('https://')) return match;
            refsUpdated++;
            return `${prefix}.webp${suffix}`;
          }
        );

        // Also replace in inline styles: url(...)
        content = content.replace(
          /(url\(["']?(?:[^)"']*?))(\.(?:jpg|jpeg|png))(["']?\))/gi,
          (match, prefix, ext, suffix) => {
            if (prefix.includes('http://') || prefix.includes('https://')) return match;
            refsUpdated++;
            return `${prefix}.webp${suffix}`;
          }
        );

        // Replace in background-image inline styles
        content = content.replace(
          /(background(?:-image)?:\s*url\((?:&quot;|"|')?(?:\/[^)"'&]*?))(\.(?:jpg|jpeg|png))((?:&quot;|"|')?\))/gi,
          (match, prefix, ext, suffix) => {
            if (prefix.includes('http://') || prefix.includes('https://')) return match;
            refsUpdated++;
            return `${prefix}.webp${suffix}`;
          }
        );

        if (content !== original) {
          fs.writeFileSync(fullPath, content);
          filesUpdated++;
        }
      }
    }
  }

  processDir(APP_DIR);
  return { filesUpdated, refsUpdated };
}

async function main() {
  console.log('\n🖼️  Aenfinite Image Optimizer');
  console.log('   Converting images to WebP format...\n');

  // Step 1: Find all images
  const images = findImages(PUBLIC_DIR);
  stats.totalImages = images.length;
  console.log(`Found ${images.length} images to process\n`);

  // Step 2: Convert to WebP (batch for speed)
  const BATCH_SIZE = 5;
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(img => convertToWebp(img)));
    
    // Progress
    const done = Math.min(i + BATCH_SIZE, images.length);
    if (done % 25 === 0 || done === images.length) {
      process.stdout.write(`  Progress: ${done}/${images.length}\r`);
    }
  }

  console.log(`\n\n📊 Image Conversion Results:`);
  console.log(`   Total: ${stats.totalImages} images`);
  console.log(`   Converted: ${stats.converted}`);
  console.log(`   Skipped: ${stats.skipped}`);
  console.log(`   Failed: ${stats.failed}`);
  console.log(`   Original size: ${(stats.originalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   WebP size: ${(stats.newSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Savings: ${((1 - stats.newSize / stats.originalSize) * 100).toFixed(0)}%`);

  // Step 3: Update page references
  console.log(`\n📝 Updating page.tsx references to .webp...`);
  const { filesUpdated, refsUpdated } = updatePageReferences();
  console.log(`   Updated ${refsUpdated} image references across ${filesUpdated} files`);
  
  console.log(`\n✅ Done!\n`);
}

main().catch(console.error);
