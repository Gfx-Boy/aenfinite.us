import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for deployment on any static host / Nginx
  // Remove this line if you want to use SSR with Node.js server
  // output: 'export',
  
  // Trailing slash to match original WordPress URL structure
  trailingSlash: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aenfinite.us',
      },
    ],
    unoptimized: true, // Set to false if using Vercel
  },

  // Redirects from old & URLs to new clean URLs
  async redirects() {
    return [
      // Services with & in URL
      {
        source: '/services/ai-chatbots-&-virtual-assistants/',
        destination: '/services/ai-chatbots-and-virtual-assistants/',
        permanent: true,
      },
      {
        source: '/services/software-&-platform-development/',
        destination: '/services/software-and-platform-development/',
        permanent: true,
      },
      {
        source: '/services/workflow-&-business-automation/',
        destination: '/services/workflow-and-business-automation/',
        permanent: true,
      },
      // Work with & in URL
      {
        source: '/work/web-design-&-development/',
        destination: '/work/web-design-and-development/',
        permanent: true,
      },
      // City with & in URL
      {
        source: '/city/ai-&-technology-solutions/',
        destination: '/city/ai-and-technology-solutions/',
        permanent: true,
      },
      {
        source: '/city/design-&-creative-solutions/',
        destination: '/city/design-and-creative-solutions/',
        permanent: true,
      },
      {
        source: '/city/marketing-&-digtal-solutions/',
        destination: '/city/marketing-and-digital-solutions/',
        permanent: true,
      },
      // Cities - map old paths
      {
        source: '/Cities/los-angeles-ca/ai-chatbots-virtual-assistants-los-angeles-ca/',
        destination: '/cities/los-angeles-ca/ai-chatbots-virtual-assistants/',
        permanent: true,
      },
      {
        source: '/Cities/los-angeles-ca/graphic-design-branding-los-angeles-ca/',
        destination: '/cities/los-angeles-ca/graphic-design-branding/',
        permanent: true,
      },
      {
        source: '/Cities/los-angeles-ca/software-development-los-angeles-ca/',
        destination: '/cities/los-angeles-ca/software-development/',
        permanent: true,
      },
      {
        source: '/Cities/los-angeles-ca/web-design-marketing-agency-los-angeles-ca/',
        destination: '/cities/los-angeles-ca/web-design-marketing-agency/',
        permanent: true,
      },
      {
        source: '/Cities/los-angeles-ca/web-designing-and-digital-marketing-agency-los-angeles-ca/',
        destination: '/cities/los-angeles-ca/web-designing-and-digital-marketing-agency/',
        permanent: true,
      },
      {
        source: '/Cities/san-diego-ca/web-design-marketing-agency-san-diego-ca/',
        destination: '/cities/san-diego-ca/web-design-marketing-agency/',
        permanent: true,
      },
      // NOTE: case-fix redirects (e.g. /work/Olly/ -> /work/olly/) were removed.
      // Next.js matches redirect sources case-INsensitively, so each of those
      // rules also matched its own destination and caused an infinite 308 loop,
      // making the pages unreachable. Case normalization now lives in middleware.ts.
      {
        source: '/services/website-design/',
        destination: '/services/web-design/',
        permanent: true,
      },
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/wp-content/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/wp-includes/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JS files aggressively
        source: '/js/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Next.js static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // WebP/optimized images
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
