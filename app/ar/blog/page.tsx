// Language: Arabic (ar)
// Auto-generated from English source - do not edit directly
import type { Metadata } from 'next';
import HtmlPage from '@/components/HtmlPage';

export const metadata: Metadata = {
  title: "تصميم المواقع & التسويق الرقمي المدونة | Expert Tips & Insights | Aenfinite®",
  description: "Expert insights on web design, logo design, digital marketing, and branding. Get the latest tips, trends, and strategies to grow your business online.",
  keywords: "web design blog, digital marketing blog, branding tips, SEO insights, design trends, marketing strategies, Aenfinite blog",
  openGraph: {"title":"تصميم المواقع & التسويق الرقمي المدونة | Expert Tips & Insights | Aenfinite®","description":"Expert insights on web design, logo design, digital marketing, and branding. Get the latest tips, trends, and strategies to grow your business online.","url":"https://aenfinite.us/ar/blog/","siteName":"Aenfinite","type":"website","images":[{"url":"https://aenfinite.us/ar/blog/"}]},
  twitter: {"card":"summary_large_image","title":"تصميم المواقع & التسويق الرقمي المدونة | Aenfinite®","description":"Expert insights on web design, logo design, digital marketing, and branding.","images":["https://aenfinite.us/wp-content/uploads/2024/11/share-image-dd.jpg"]},
  robots: { index: true, follow: true },
};

const bodyClass = ``;

const headStyles = `
        /* المدونة styling would go here */
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .blog-header { text-align: center; margin-bottom: 40px; }
        .blog-posts { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .blog-post { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        .blog-post h2 { color: #227bf3; }
        .blog-post .meta { color: #666; font-size: 0.9em; margin-bottom: 15px; }
    `;

const pageContent = `<script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-K9VRBCFE61');
    </script>

    <div class="blog-header">
        <h1>تصميم المواقع & التسويق الرقمي Insights</h1>
        <p>Expert tips, trends, and strategies to grow your business online</p>
    </div>
    
    <div class="blog-posts">
        <!-- المدونة posts would be dynamically loaded here -->
        <article class="blog-post">
            <h2><a href="/blog/10-web-design-trends-2025/">10 تصميم المواقع Trends That Will Dominate 2025</a></h2>
            <div class="meta">Published: January 15, 2025 | Category: تصميم المواقع</div>
            <p>Discover the latest web design trends that will shape user experience and drive conversions in 2025...</p>
            <a href="/blog/10-web-design-trends-2025/">اقرأ المزيد →</a>
        </article>
        
        <article class="blog-post">
            <h2><a href="/blog/logo-design-psychology/">The Psychology Behind Effective تصميم الشعارات</a></h2>
            <div class="meta">Published: January 10, 2025 | Category: تصميم الشعارات</div>
            <p>Learn how color, shape, and typography in logo design influence customer perception and brand success...</p>
            <a href="/blog/logo-design-psychology/">اقرأ المزيد →</a>
        </article>
        
        <article class="blog-post">
            <h2><a href="/blog/seo-strategies-2025/">Local SEO Strategies for United States Businesses</a></h2>
            <div class="meta">Published: January 5, 2025 | Category: SEO</div>
            <p>Dominate your local market with these proven SEO strategies specifically designed for United States businesses...</p>
            <a href="/blog/seo-strategies-2025/">اقرأ المزيد →</a>
        </article>
    </div>
`;

export default function Page() {
  return (
    <>
        <script
          key="schema-0"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "المدونة",
        "name": "Aenfinite® المدونة",
        "description": "Expert insights on web design, logo design, digital marketing, and branding",
        "url":"https://aenfinite.us/ar/blog/",
        "publisher": {
            "@type": "Organization",
            "name": "Aenfinite®",
            "logo": "https://aenfinite.us/wp-content/uploads/2024/11/share-image-dd.jpg"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://aenfinite.us/blog/"
        }
    }` }}
        />
        <script
          key="schema-1"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://aenfinite.us/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "تصميم المواقع & التسويق الرقمي المدونة",
      "item": "https://aenfinite.us/blog/"
    }
  ]
}` }}
        />
      <HtmlPage content={pageContent} bodyClass={bodyClass} headStyles={headStyles} />
    </>
  );
}
