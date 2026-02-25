/**
 * HTML to Next.js Page Converter v2
 * 
 * Fixed version that properly handles malformed WordPress HTML where
 * <body> appears inside <head> without a closing </head> tag.
 * 
 * Strategy:
 * 1. Find the <body> tag position
 * 2. Everything BEFORE <body> = "head zone" -> extract ALL <style> blocks
 * 3. Everything FROM <body> to end = "body zone" -> this is the page content
 * 4. Prepend extracted styles INTO the body content so they render together
 * 5. Extract metadata from the full HTML for SSR SEO
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../../aenfinite-llc');
const TARGET_DIR = path.resolve(__dirname, '../app');

// ─── SEO Enhancement Map ───────────────────────────────────────────────────────
// Per-route keywords + fallback schema types for comprehensive SEO coverage
const SEO_ENHANCEMENTS = {
  // ── Homepage ──
  '(pages)': {
    keywords: 'digital agency, web design agency, branding agency, digital marketing agency United States, UI UX design, custom web development, SEO services, app development, e-commerce development, digital transformation, Aenfinite',
    schemaType: 'Organization',
  },
  'darkmode': {
    keywords: 'digital agency, web design, branding, SEO, AI solutions, digital marketing, business automation, UI UX design, Aenfinite',
    schemaType: 'WebPage',
  },

  // ── Services Hub ──
  'services': {
    keywords: 'web design services, digital marketing services, logo design, branding services, SEO services, app development, custom web development, graphic design, social media marketing, Aenfinite',
    schemaType: 'Service',
  },

  // ── Individual Services ──
  'services/ai-chatbots-and-virtual-assistants': {
    keywords: 'AI chatbots, virtual assistants, conversational AI, chatbot development, customer service automation, NLP chatbot, AI customer support, intelligent virtual assistant, Aenfinite',
    schemaType: 'Service',
  },
  'services/app-development': {
    keywords: 'app development, mobile app development, iOS app development, Android app development, cross-platform app, React Native, Flutter, full-stack app development, Aenfinite',
    schemaType: 'Service',
  },
  'services/branding': {
    keywords: 'branding agency, brand identity, brand strategy, brand guidelines, visual identity design, corporate branding, startup branding, rebranding, Aenfinite',
    schemaType: 'Service',
  },
  'services/conference-branding': {
    keywords: 'conference branding, event branding, event identity design, conference signage, event marketing, trade show branding, conference visual identity, Aenfinite',
    schemaType: 'Service',
  },
  'services/custom-web-development': {
    keywords: 'custom web development, bespoke website development, custom website, web application development, API integration, full-stack development, tailored web solutions, Aenfinite',
    schemaType: 'Service',
  },
  'services/digital-marketing': {
    keywords: 'digital marketing, social media marketing, content marketing, email marketing, online marketing, digital advertising, brand management, marketing strategy, Aenfinite',
    schemaType: 'Service',
  },
  'services/e-commerce-websites': {
    keywords: 'e-commerce website development, online store development, Shopify development, WooCommerce development, payment gateway integration, shopping cart development, e-commerce solutions, Aenfinite',
    schemaType: 'Service',
  },
  'services/graphic-design': {
    keywords: 'graphic design, print design, visual communication, brand collateral, marketing materials, infographic design, flyer design, poster design, Aenfinite',
    schemaType: 'Service',
  },
  'services/logo-design': {
    keywords: 'logo design, custom logo, brand identity design, logo creation, wordmark logo, emblem logo, minimalist logo, professional logo design, Aenfinite',
    schemaType: 'Service',
  },
  'services/packaging-design': {
    keywords: 'packaging design, product packaging, box design, label design, custom packaging, retail packaging, premium packaging design, Aenfinite',
    schemaType: 'Service',
  },
  'services/paid-ads': {
    keywords: 'paid advertising, Google Ads management, Facebook Ads, PPC management, paid media, display advertising, remarketing, social media ads, Aenfinite',
    schemaType: 'Service',
  },
  'services/pay-per-click': {
    keywords: 'PPC advertising, pay per click, Google Ads, Bing Ads, PPC management, campaign optimization, conversion tracking, SEM, cost per click, Aenfinite',
    schemaType: 'Service',
  },
  'services/search-engine-optimization': {
    keywords: 'SEO services, search engine optimization, keyword research, on-page SEO, technical SEO, link building, local SEO, organic traffic, SERP ranking, Aenfinite',
    schemaType: 'Service',
  },
  'services/social-media-marketing': {
    keywords: 'social media marketing, Instagram marketing, Facebook marketing, TikTok marketing, LinkedIn marketing, social media management, community management, social strategy, Aenfinite',
    schemaType: 'Service',
  },
  'services/software-and-platform-development': {
    keywords: 'software development, platform development, enterprise software, SaaS development, custom software, system architecture, scalable applications, digital transformation, Aenfinite',
    schemaType: 'Service',
  },
  'services/trade-show-booth-design': {
    keywords: 'trade show booth design, exhibition booth, trade show display, booth construction, event branding, trade show marketing, exhibition design, Aenfinite',
    schemaType: 'Service',
  },
  'services/ui-ux-design': {
    keywords: 'UI UX design, user interface design, user experience design, wireframing, prototyping, usability testing, interaction design, UX research, Aenfinite',
    schemaType: 'Service',
  },
  'services/web-design': {
    keywords: 'web design, website design, responsive web design, modern web design, creative web design, professional website design, UI design, Aenfinite',
    schemaType: 'Service',
  },
  'services/web-design-and-branding-for-real-estate': {
    keywords: 'real estate web design, property website design, real estate branding, MLS integration, real estate marketing, agent website, IDX website, Aenfinite',
    schemaType: 'Service',
  },
  'services/wordpress-websites': {
    keywords: 'WordPress development, WordPress website, custom WordPress theme, WooCommerce development, WordPress plugin development, WordPress maintenance, Elementor, Aenfinite',
    schemaType: 'Service',
  },
  'services/workflow-and-business-automation': {
    keywords: 'workflow automation, business automation, GoHighLevel implementation, process optimization, digital transformation, CRM automation, marketing automation, Zapier integration, Aenfinite',
    schemaType: 'Service',
  },

  // ── Work / Portfolio Hub ──
  'work': {
    keywords: 'portfolio, design portfolio, web design portfolio, branding portfolio, case studies, client work, creative projects, Aenfinite portfolio',
    schemaType: 'CollectionPage',
  },
  'work/all': {
    keywords: 'all projects, complete portfolio, design work, development projects, branding projects, app projects, Aenfinite case studies',
    schemaType: 'CollectionPage',
  },

  // ── Individual Work Projects ──
  'work/afropopup': {
    keywords: 'AfroPop craft soda, e-commerce website design, Shopify design, artist collaboration platform, beverage e-commerce, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/algopros': {
    keywords: 'Algopros logo design, brand identity, graphic design studio, logo design case study, visual branding, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/amkiservice': {
    keywords: 'AM-KI Services, business compliance, licensing platform, corporate consulting website, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/ansu': {
    keywords: 'Ansu neural interface, brain-computer technology, neurotechnology platform, UI UX design, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/blue-vine-marketing': {
    keywords: 'Blue Vine Marketing, digital marketing agency website, lead generation, social media management, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/branding': {
    keywords: 'branding portfolio, brand identity projects, branding case studies, logo and branding, creative branding, Aenfinite branding work',
    schemaType: 'CollectionPage',
  },
  'work/cimeo-vision': {
    keywords: 'Cimeo Vision, audiovisual integration, AV solutions, LED screens, meeting room AV, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/feiro': {
    keywords: 'Feiro brand identity, business solutions, branding design, strategic branding, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/fiscoclic': {
    keywords: 'FiscoClic, electronic invoicing, CFDI app, Mexican invoicing, mobile app development, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/global-design-solution': {
    keywords: '3D laser scanning, digital twin, Global Design Solutions, infrastructure modernization, 3D modeling, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/graphic-design': {
    keywords: 'graphic design portfolio, print design projects, visual design work, creative design, Aenfinite graphic design',
    schemaType: 'CollectionPage',
  },
  'work/husnohaya': {
    keywords: 'HusnOhaya, modest fashion e-commerce, hijab e-commerce, Shopify store, fashion website design, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/khatech': {
    keywords: 'KhaTtech, digital marketing agency, SEO agency, marketing automation, web development, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/logo-design': {
    keywords: 'logo design portfolio, logo projects, brand mark design, custom logos, Aenfinite logo work',
    schemaType: 'CollectionPage',
  },
  'work/lumea': {
    keywords: 'Lumea wellness app, light therapy app, circadian rhythm, wellness tracking, mobile app UI UX, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/mindfit': {
    keywords: 'Mindfit, mental wellness app, fitness app, holistic health, mobile app development, UI UX design, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/mobile-apps': {
    keywords: 'mobile app portfolio, iOS app projects, Android app projects, app development case studies, Aenfinite mobile apps',
    schemaType: 'CollectionPage',
  },
  'work/neocert': {
    keywords: 'NeoCert, concert booking app, event management platform, mobile app design, UI UX, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/neurolinker': {
    keywords: 'Neurolinker, brain-computer interface, neurotechnology, cognitive enhancement, neural interface design, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/olly': {
    keywords: 'Olly personal assistant, AI productivity app, smart scheduling, task management app, mobile app design, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/packaging-design': {
    keywords: 'packaging design portfolio, product packaging projects, box design, label design, Aenfinite packaging work',
    schemaType: 'CollectionPage',
  },
  'work/quarena': {
    keywords: 'Quarena trading app, cryptocurrency trading, stock trading platform, fintech UI UX, mobile app design, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/robophil': {
    keywords: 'RoboPhil, robotics logo design, brand identity, visual identity, modern typography, Aenfinite project',
    schemaType: 'CreativeWork',
  },
  'work/web-design-and-development': {
    keywords: 'web design portfolio, web development projects, website case studies, responsive design, custom websites, Aenfinite web work',
    schemaType: 'CollectionPage',
  },

  // ── City Templates ──
  'city': {
    keywords: 'web design agency, local web design, city web design, custom website development, local SEO, business website, Aenfinite',
    schemaType: 'WebPage',
  },
  'city/ai-and-technology-solutions': {
    keywords: 'AI solutions, chatbot development, virtual assistants, technology consulting, AI integration, local AI services, Aenfinite',
    schemaType: 'Service',
  },
  'city/design-and-creative-solutions': {
    keywords: 'design services, creative solutions, branding, logo design, graphic design, UI UX design, local design agency, Aenfinite',
    schemaType: 'Service',
  },
  'city/development': {
    keywords: 'software development, platform development, web development, custom software, enterprise solutions, local development agency, Aenfinite',
    schemaType: 'Service',
  },
  'city/main-hub': {
    keywords: 'web design agency, digital marketing, local business website, custom web development, SEO, branding, Aenfinite',
    schemaType: 'WebPage',
  },
  'city/marketing-and-digital-solutions': {
    keywords: 'digital marketing, SEO, PPC, social media marketing, content marketing, email marketing, local marketing agency, Aenfinite',
    schemaType: 'Service',
  },

  // ── Cities (Instantiated) ──
  'cities/los-angeles-ca/ai-chatbots-virtual-assistants': {
    keywords: 'AI chatbots Los Angeles, virtual assistants LA, conversational AI Los Angeles CA, chatbot development LA, Aenfinite Los Angeles',
    schemaType: 'Service',
  },
  'cities/los-angeles-ca/graphic-design-branding': {
    keywords: 'graphic design Los Angeles, branding Los Angeles, logo design LA, creative agency Los Angeles CA, Aenfinite Los Angeles',
    schemaType: 'Service',
  },
  'cities/los-angeles-ca/software-development': {
    keywords: 'software development Los Angeles, web development LA, custom software Los Angeles CA, app development LA, Aenfinite Los Angeles',
    schemaType: 'Service',
  },
  'cities/los-angeles-ca/web-design-marketing-agency': {
    keywords: 'web design Los Angeles, marketing agency LA, web design agency Los Angeles CA, digital marketing LA, Aenfinite Los Angeles',
    schemaType: 'LocalBusiness',
  },
  'cities/los-angeles-ca/web-designing-and-digital-marketing-agency': {
    keywords: 'web design Los Angeles, digital marketing LA, web development agency Los Angeles CA, SEO Los Angeles, Aenfinite Los Angeles',
    schemaType: 'Service',
  },
  'cities/san-diego-ca/web-design-marketing-agency': {
    keywords: 'web design San Diego, marketing agency San Diego, web design agency San Diego CA, digital marketing San Diego, Aenfinite San Diego',
    schemaType: 'LocalBusiness',
  },

  // ── Agency ──
  'agency': {
    keywords: 'design agency United States, branding agency, web design agency, app development agency, packaging design agency, digital agency, Aenfinite about',
    schemaType: 'Organization',
  },
  'agency/partner-with-us': {
    keywords: 'agency partnership, white label partnership, referral program, strategic partnership, agency collaboration, Aenfinite partner',
    schemaType: 'WebPage',
  },
  'agency/partner-with-us/ghl-services': {
    keywords: 'GoHighLevel implementation, GHL services, GoHighLevel automation, CRM implementation, GHL white label, workflow automation, Aenfinite GHL',
    schemaType: 'Service',
  },
  'agency/partner-with-us/referral-program': {
    keywords: 'referral program, refer clients, earn rewards, agency referral, client referral program, Aenfinite referral',
    schemaType: 'WebPage',
  },
  'agency/partner-with-us/white-label-services': {
    keywords: 'white label services, white label web design, white label development, agency outsourcing, white label digital marketing, Aenfinite white label',
    schemaType: 'Service',
  },

  // ── Other Pages ──
  'contact': {
    keywords: 'contact Aenfinite, United States web agency contact, get a quote, free consultation, web design inquiry, digital marketing contact, Aenfinite contact',
    schemaType: 'ContactPage',
  },
  'blog': {
    keywords: 'web design blog, digital marketing blog, branding tips, SEO insights, design trends, marketing strategies, Aenfinite blog',
    schemaType: 'Blog',
  },
  'featured-work': {
    keywords: 'featured work, award-winning design, best projects, featured portfolio, top design projects, Aenfinite featured work',
    schemaType: 'CollectionPage',
  },
  'privacy-policy': {
    keywords: 'privacy policy, data protection, cookies policy, GDPR, user privacy, Aenfinite privacy',
    schemaType: 'WebPage',
  },
};

// ─── Default fallback image for OG/Twitter ──────────────────────────────────
const DEFAULT_OG_IMAGE = 'https://aenfinite.us/wp-content/themes/aenfinite.us/images/thumbnail.jpg';
const SITE_URL = 'https://aenfinite.us';

const PAGES = [
  { src: 'index.html', route: '(pages)' },
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
  { src: 'city/index.html', route: 'city' },
  { src: 'city/ai-&-technology-solutions/index.html', route: 'city/ai-and-technology-solutions' },
  { src: 'city/design-&-creative-solutions/index.html', route: 'city/design-and-creative-solutions' },
  { src: 'city/development/index.html', route: 'city/development' },
  { src: 'city/main-hub/index.html', route: 'city/main-hub' },
  { src: 'city/marketing-&-digtal-solutions/index.html', route: 'city/marketing-and-digital-solutions' },
  { src: 'Cities/los-angeles-ca/ai-chatbots-virtual-assistants-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/ai-chatbots-virtual-assistants' },
  { src: 'Cities/los-angeles-ca/graphic-design-branding-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/graphic-design-branding' },
  { src: 'Cities/los-angeles-ca/software-development-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/software-development' },
  { src: 'Cities/los-angeles-ca/web-design-marketing-agency-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/web-design-marketing-agency' },
  { src: 'Cities/los-angeles-ca/web-designing-and-digital-marketing-agency-los-angeles-ca/index.html', route: 'cities/los-angeles-ca/web-designing-and-digital-marketing-agency' },
  { src: 'Cities/san-diego-ca/web-design-marketing-agency-san-diego-ca/index.html', route: 'cities/san-diego-ca/web-design-marketing-agency' },
  { src: 'agency/index.html', route: 'agency' },
  { src: 'agency/partner-with-us/index.html', route: 'agency/partner-with-us' },
  { src: 'agency/partner-with-us/ghl-services/index.html', route: 'agency/partner-with-us/ghl-services' },
  { src: 'agency/partner-with-us/referral-program/index.html', route: 'agency/partner-with-us/referral-program' },
  { src: 'agency/partner-with-us/white-label-services/index.html', route: 'agency/partner-with-us/white-label-services' },
  { src: 'contact/index.html', route: 'contact' },
  { src: 'blog/index.html', route: 'blog' },
  { src: 'featured-work/index.html', route: 'featured-work' },
  { src: 'privacy-policy/index.html', route: 'privacy-policy' },
  { src: 'darkmode/index.html', route: 'darkmode' },
];

/**
 * Extract metadata from full HTML, with SEO enhancements fallbacks
 */
function extractMetadata(html, route) {
  const meta = {};
  const enhancements = SEO_ENHANCEMENTS[route] || {};

  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  meta.title = titleMatch ? titleMatch[1].trim() : 'Aenfinite';
  
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is);
  meta.description = descMatch ? descMatch[1].trim() : '';
  
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/is);
  meta.canonical = canonMatch ? canonMatch[1].trim() : '';
  
  // ── Open Graph (extract or generate fallback) ──
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/is);
  const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/is);
  const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/is);
  const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["'](.*?)["']/is);
  
  meta.openGraph = {
    title: ogTitle ? ogTitle[1].trim() : meta.title,
    description: ogDesc ? ogDesc[1].trim() : meta.description,
    url: ogUrl ? ogUrl[1].trim() : (meta.canonical || `${SITE_URL}/${route === '(pages)' ? '' : route + '/'}`),
    siteName: 'Aenfinite',
    type: 'website',
    images: [{ url: ogImage ? ogImage[1].trim() : DEFAULT_OG_IMAGE }],
  };
  
  // ── Twitter Card (extract or generate fallback) ──
  const twCard = html.match(/<meta\s+name=["']twitter:card["']\s+content=["'](.*?)["']/is);
  const twTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/is);
  const twDesc = html.match(/<meta\s+name=["']twitter:description["']\s+content=["'](.*?)["']/is);
  const twImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["'](.*?)["']/is);
  
  meta.twitter = {
    card: twCard ? twCard[1].trim() : 'summary_large_image',
    title: twTitle ? twTitle[1].trim() : meta.title,
    description: twDesc ? twDesc[1].trim() : meta.description,
    images: [twImage ? twImage[1].trim() : DEFAULT_OG_IMAGE],
  };

  // ── Keywords (extract then override/add from enhancement map) ──
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/is);
  const existingKeywords = keywordsMatch ? keywordsMatch[1].trim() : '';
  // Use enhancement keywords if available, otherwise keep existing
  meta.keywords = enhancements.keywords || existingKeywords || '';

  // ── Schema.org / JSON-LD (extract existing) ──
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

  // ── Generate fallback schemas if none found ──
  if (meta.schemas.length === 0) {
    const pageUrl = meta.canonical || `${SITE_URL}/${route === '(pages)' ? '' : route + '/'}`;
    const fallbackSchemas = generateFallbackSchemas(route, meta, enhancements, pageUrl);
    meta.schemas.push(...fallbackSchemas);
  }

  // ── Generate BreadcrumbList for deep pages ──
  if (route !== '(pages)' && route !== 'darkmode') {
    const breadcrumb = generateBreadcrumb(route, meta.title);
    if (breadcrumb) {
      meta.schemas.push(breadcrumb);
    }
  }

  return meta;
}

/**
 * Generate fallback JSON-LD schemas based on page type
 */
function generateFallbackSchemas(route, meta, enhancements, pageUrl) {
  const schemas = [];
  const schemaType = enhancements.schemaType || 'WebPage';

  // Base WebPage/WebSite schema (always)
  const webPage = {
    '@context': 'https://schema.org',
    '@type': schemaType === 'CollectionPage' ? 'CollectionPage' 
           : schemaType === 'ContactPage' ? 'ContactPage'
           : schemaType === 'Blog' ? 'Blog'
           : 'WebPage',
    name: meta.title,
    description: meta.description,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Aenfinite',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/wp-content/themes/aenfinite.us/images/thumbnail.jpg`,
      },
    },
  };

  // Service pages: create a Service schema
  if (schemaType === 'Service') {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: meta.title.split('|')[0].trim(),
      description: meta.description,
      url: pageUrl,
      provider: {
        '@type': 'Organization',
        name: 'Aenfinite',
        url: SITE_URL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'United States',
          addressRegion: '',
          addressCountry: 'US',
        },
      },
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
    };
    schemas.push(JSON.stringify(serviceSchema, null, 2));
  }

  // Organization pages
  if (schemaType === 'Organization') {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Aenfinite',
      url: SITE_URL,
      logo: `${SITE_URL}/wp-content/themes/aenfinite.us/images/thumbnail.jpg`,
      description: meta.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'United States',
        addressRegion: '',
        addressCountry: 'US',
      },
      sameAs: [
        'https://www.instagram.com/aenfinite/',
        'https://www.linkedin.com/company/aenfinite/',
        'https://www.facebook.com/aenfinite/',
      ],
    };
    schemas.push(JSON.stringify(orgSchema, null, 2));
    return schemas; // Don't add WebPage for Organization
  }

  // ContactPage / LocalBusiness
  if (schemaType === 'ContactPage' || schemaType === 'LocalBusiness') {
    const localBiz = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Aenfinite',
      url: SITE_URL,
      description: meta.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'United States',
        addressRegion: '',
        postalCode: '',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.8283,
        longitude: -98.5795,
      },
      telephone: '+1-720-831-1484',
      email: 'info@aenfinite.us',
      openingHours: 'Mo-Fr 09:00-18:00',
      priceRange: '$$',
      sameAs: [
        'https://www.instagram.com/aenfinite/',
        'https://www.linkedin.com/company/aenfinite/',
        'https://www.facebook.com/aenfinite/',
      ],
    };
    schemas.push(JSON.stringify(localBiz, null, 2));
    if (schemaType === 'ContactPage') {
      schemas.push(JSON.stringify(webPage, null, 2));
    }
    return schemas;
  }

  // CreativeWork (portfolio projects)
  if (schemaType === 'CreativeWork') {
    const creativeWork = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: meta.title.split('|')[0].trim(),
      description: meta.description,
      url: pageUrl,
      creator: {
        '@type': 'Organization',
        name: 'Aenfinite',
        url: SITE_URL,
      },
      image: meta.openGraph.images[0].url,
    };
    schemas.push(JSON.stringify(creativeWork, null, 2));
    return schemas;
  }

  // Default: WebPage
  schemas.push(JSON.stringify(webPage, null, 2));
  return schemas;
}

/**
 * Generate BreadcrumbList JSON-LD for nested pages
 */
function generateBreadcrumb(route, title) {
  const parts = route.split('/');
  if (parts.length < 1) return null;

  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
  ];

  let currentPath = '';
  for (let i = 0; i < parts.length; i++) {
    currentPath += '/' + parts[i];
    const name = i === parts.length - 1
      ? (title ? title.split('|')[0].trim() : parts[i])
      : parts[i].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    const item = {
      '@type': 'ListItem',
      position: i + 2,
      name: name,
      item: SITE_URL + currentPath + '/',
    };
    items.push(item);
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };

  return JSON.stringify(breadcrumb, null, 2);
}

/**
 * Fix asset paths - normalize all relative paths to absolute
 */
function fixAssetPaths(html) {
  let fixed = html;
  // Fix relative paths like ../wp-content, ../../wp-content etc to /wp-content
  fixed = fixed.replace(/(?:\.\.\/)+wp-content\//g, '/wp-content/');
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
  // Fix paths without leading / for wp-content at start of attribute values
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
 * Split HTML into head zone and body zone using <body> tag position
 */
function splitHTML(html, isHomepage = false) {
  // Find <body...> tag - handles both <body> and <body class="...">
  const bodyMatch = html.match(/<body(\s[^>]*)?>/i);
  if (!bodyMatch) {
    console.warn('  No <body> tag found, using full HTML as content');
    return { headZone: '', bodyContent: html, bodyClass: '' };
  }
  
  const bodyTagIndex = html.indexOf(bodyMatch[0]);
  const bodyTagEnd = bodyTagIndex + bodyMatch[0].length;
  
  const headZone = html.substring(0, bodyTagIndex);
  
  // Extract body class
  const classMatch = bodyMatch[0].match(/class=["'](.*?)["']/i);
  let bodyClass = classMatch ? classMatch[1] : '';
  // Remove body_hide, deduplicate classes
  // For homepage: keep 'loading' so demo5163.js triggers splash animation
  // For other pages: strip 'loading' to prevent black screen
  const classesToRemove = isHomepage 
    ? ['body_hide'] 
    : ['body_hide', 'loading'];
  bodyClass = bodyClass
    .split(/\s+/)
    .filter(c => c && !classesToRemove.includes(c))
    .filter((c, i, arr) => arr.indexOf(c) === i) // deduplicate
    .join(' ');
  
  // Get content from after <body> to </body> or </html> or end of file
  let bodyEnd = html.indexOf('</body>', bodyTagEnd);
  if (bodyEnd === -1) bodyEnd = html.indexOf('</html>', bodyTagEnd);
  if (bodyEnd === -1) bodyEnd = html.length;
  
  let bodyContent = html.substring(bodyTagEnd, bodyEnd);
  
  // For non-homepage pages: remove the preloader div (splash screen)
  if (!isHomepage) {
    bodyContent = bodyContent.replace(
      /<div\s+class="preloader">[\s\S]*?<\/div>\s*<\/div>/i,
      ''
    );
  }
  
  return { headZone, bodyContent, bodyClass };
}

/**
 * Extract ALL <style> blocks from the head zone
 */
function extractAllStyles(headZone) {
  const styles = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(headZone)) !== null) {
    styles.push(match[1]);
  }
  return styles.join('\n');
}

/**
 * Extract inline scripts from head zone (cursor system, dropdown nav, etc.)
 * These are critical for functionality
 */
function extractHeadInlineScripts(headZone) {
  const scripts = [];
  // Match inline scripts (not JSON-LD, not external src)
  const scriptRegex = /<script(?!\s+type=["']application\/ld\+json["'])(?!\s+[^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(headZone)) !== null) {
    const content = match[1].trim();
    if (content && content.length > 20) {
      scripts.push(match[0]); // Keep the full <script> tag
    }
  }
  return scripts.join('\n');
}

/**
 * Extract SVG filter definitions from head zone
 */
function extractSVGDefs(headZone) {
  const svgs = [];
  const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
  let match;
  while ((match = svgRegex.exec(headZone)) !== null) {
    svgs.push(match[0]);
  }
  return svgs.join('\n');
}

/**
 * Generate Next.js page component
 */
function generatePage(pageDef, html) {
  const meta = extractMetadata(html, pageDef.route);
  const isHomepage = pageDef.route === '(pages)';
  const isDarkmode = pageDef.route === 'darkmode';
  const { headZone, bodyContent, bodyClass } = splitHTML(html, isHomepage);
  
  // Extract styles from head zone
  const headStyles = extractAllStyles(headZone);
  
  // Extract inline scripts from head zone (cursor, dropdown, etc.) 
  const headInlineScripts = extractHeadInlineScripts(headZone);
  
  // Extract SVG defs from head zone
  const headSVGs = extractSVGDefs(headZone);
  
  // Build the complete page content:
  // Inline styles go separately (injected into <head> to preserve CSS cascade order)
  // SVG defs and inline scripts go into body content
  let fullContent = '';
  
  if (headSVGs) {
    fullContent += headSVGs + '\n';
  }
  if (headInlineScripts) {
    fullContent += headInlineScripts + '\n';
  }
  
  fullContent += bodyContent;
  
  // Fix all asset paths
  fullContent = fixAssetPaths(fullContent);
  let fixedHeadStyles = headStyles ? fixAssetPaths(headStyles) : '';
  
  // Darkmode-specific path fixes
  if (isDarkmode) {
    // Fix AOS CSS from broken relative path to CDN
    fullContent = fullContent.replace(
      /href="[^"]*unpkg\.com[^"]*aos[^"]*\.css[^"]*"/g,
      'href="https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css"'
    );
    // Fix relative script paths (from /darkmode/ context)
    fullContent = fullContent.replace(
      /src="email-subscription\.js"/g,
      'src="/darkmode/email-subscription.js"'
    );
    fullContent = fullContent.replace(
      /src="js\/button-highlights\.js"/g,
      'src="/js/button-highlights.js"'
    );
    // Fix Clearbit relative path to proper https URL
    fullContent = fullContent.replace(
      /['"]\.\.\/\.\.\/grow\.clearbitjs\.com\/api\/pixelec92\.js\?v=['"]/g,
      "'https://grow.clearbitjs.com/api/pixel.js?v='"
    );
  }
  
  // Build metadata
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

  // JSON-LD
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

  const escapedContent = escapeForTemplate(fullContent);
  const escapedBodyClass = escapeForTemplate(bodyClass);
  const escapedHeadStyles = escapeForTemplate(fixedHeadStyles);

  // Darkmode page uses different CSS (main8783.css from black-static)
  const overrideCssProp = isDarkmode 
    ? `\nconst overrideCss = "/wp-content/themes/aenfinite.us/black-static/css/main8783.css?v=20221012-1710";\n`
    : '';
  const overrideCssJsx = isDarkmode
    ? ' overrideCss={overrideCss}'
    : '';

  const pageContent = `import type { Metadata } from 'next';
import HtmlPage from '@/components/HtmlPage';

export const metadata: Metadata = {
${metadataLines.join('\n')}
};

const bodyClass = \`${escapedBodyClass}\`;

const headStyles = \`${escapedHeadStyles}\`;
${overrideCssProp}
const pageContent = \`${escapedContent}\`;

export default function Page() {
  return (
    <>
${jsonLdSection ? jsonLdSection : '      {/* No JSON-LD */}'}
      <HtmlPage content={pageContent} bodyClass={bodyClass} headStyles={headStyles}${overrideCssJsx} />
    </>
  );
}
`;

  return pageContent;
}

/**
 * Main conversion
 */
function main() {
  console.log('🚀 Starting HTML to Next.js conversion v2...\n');
  
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
      
      let outputDir;
      if (pageDef.route === '(pages)') {
        outputDir = TARGET_DIR;
      } else {
        outputDir = path.join(TARGET_DIR, pageDef.route);
      }
      
      fs.mkdirSync(outputDir, { recursive: true });
      const outputFile = path.join(outputDir, 'page.tsx');
      fs.writeFileSync(outputFile, pageContent, 'utf-8');
      
      console.log(`✅ ${pageDef.route.padEnd(60)} → ${path.relative(TARGET_DIR, outputFile)}`);
      successCount++;
    } catch (err) {
      console.log(`❌ Error: ${pageDef.src}: ${err.message}`);
      errors.push({ src: pageDef.src, error: err.message });
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Successfully converted: ${successCount} pages`);
  console.log(`❌ Errors: ${errorCount} pages`);
  if (errors.length > 0) {
    console.log('\nFailed:');
    errors.forEach(e => console.log(`  - ${e.src}: ${e.error}`));
  }
  console.log('\nDone! 🎉');
}

main();
