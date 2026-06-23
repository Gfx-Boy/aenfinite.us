import type { Metadata } from 'next';
import HtmlPage from '@/components/HtmlPage';

export const metadata: Metadata = {
  title: "Web Design & Digital Marketing Blog | Expert Tips & Insights",
  description: "Expert insights on web design, logo design, digital marketing, and branding. Get the latest tips, trends, and strategies to grow your business online.",
  keywords: "web design blog, digital marketing blog, branding tips, SEO insights, design trends, marketing strategies, Aenfinite blog",
  openGraph: {"title":"Web Design & Digital Marketing Blog | Expert Tips & Insights | Aenfinite®","description":"Expert insights on web design, logo design, digital marketing, and branding. Get the latest tips, trends, and strategies to grow your business online.","url":"https://aenfinite.us/blog/","siteName":"Aenfinite","type":"website","images":[{"url":"https://aenfinite.us/wp-content/themes/aenfinite.us/images/thumbnail.jpg"}]},
  twitter: {"card":"summary_large_image","title":"Web Design & Digital Marketing Blog | Aenfinite®","description":"Expert insights on web design, logo design, digital marketing, and branding.","images":["https://aenfinite.us/wp-content/uploads/2024/11/share-image-dd.jpg"]},
  robots: { index: true, follow: true },
};

const bodyClass = ``;

const headStyles = `
        /* Blog styling would go here */
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
        <h1>Web Design & Digital Marketing Insights</h1>
        <p>Expert tips, trends, and strategies to grow your business online</p>
    </div>
    
    <div class="blog-posts">
        <!-- Blog posts would be dynamically loaded here -->
        <article class="blog-post">
            <h2><a href="/blog/">10 Web Design Trends That Will Dominate 2025</a></h2>
            <div class="meta">Published: January 15, 2025 | Category: Web Design</div>
            <p>Discover the latest web design trends that will shape user experience and drive conversions in 2025...</p>
            <a href="/blog/">Read More →</a>
        </article>
        
        <article class="blog-post">
            <h2><a href="/blog/">The Psychology Behind Effective Logo Design</a></h2>
            <div class="meta">Published: January 10, 2025 | Category: Logo Design</div>
            <p>Learn how color, shape, and typography in logo design influence customer perception and brand success...</p>
            <a href="/blog/">Read More →</a>
        </article>
        
        <article class="blog-post">
            <h2><a href="/blog/">Local SEO Strategies for United States Businesses</a></h2>
            <div class="meta">Published: January 5, 2025 | Category: SEO</div>
            <p>Dominate your local market with these proven SEO strategies specifically designed for United States businesses...</p>
            <a href="/blog/">Read More →</a>
        </article>
    </div>

<div class="sitemap-footer" style="text-align: center; padding: 20px 0 40px;"><a href="/sitemap.xml" style="color: #999; text-decoration: none; font-size: 14px; font-family: sans-serif; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#999'">Sitemap</a></div>

<!-- AEN-FAQ START -->
<section class='aen-faq-block' aria-labelledby='aen-faq-title' style='max-width:1000px;margin:64px auto;padding:32px 24px;font-family:inherit;'>
  <h2 id='aen-faq-title' style='font-size:clamp(26px,4vw,38px);font-weight:700;margin:0 0 28px;line-height:1.2;'>Frequently Asked Questions</h2>
  <div itemscope itemtype='https://schema.org/FAQPage'>
    <details class='aen-faq-item' itemscope itemprop='mainEntity' itemtype='https://schema.org/Question' style='border:1px solid rgba(128,128,128,0.25);border-radius:12px;margin-bottom:14px;padding:16px 20px;'>
      <summary itemprop='name' style='cursor:pointer;font-weight:600;font-size:clamp(16px,2.2vw,19px);line-height:1.45;'>What topics does the Aenfinite blog cover?</summary>
      <div itemscope itemprop='acceptedAnswer' itemtype='https://schema.org/Answer' style='margin-top:12px;'>
        <div itemprop='text' style='line-height:1.7;font-size:16px;opacity:0.85;'>Our blog shares insights on web design, branding, SEO, digital marketing, AI, and business growth to help you make smarter decisions.</div>
      </div>
    </details>
    <details class='aen-faq-item' itemscope itemprop='mainEntity' itemtype='https://schema.org/Question' style='border:1px solid rgba(128,128,128,0.25);border-radius:12px;margin-bottom:14px;padding:16px 20px;'>
      <summary itemprop='name' style='cursor:pointer;font-weight:600;font-size:clamp(16px,2.2vw,19px);line-height:1.45;'>How often do you publish new articles?</summary>
      <div itemscope itemprop='acceptedAnswer' itemtype='https://schema.org/Answer' style='margin-top:12px;'>
        <div itemprop='text' style='line-height:1.7;font-size:16px;opacity:0.85;'>We publish new articles regularly, so subscribe or check back often for the latest strategies and trends.</div>
      </div>
    </details>
    <details class='aen-faq-item' itemscope itemprop='mainEntity' itemtype='https://schema.org/Question' style='border:1px solid rgba(128,128,128,0.25);border-radius:12px;margin-bottom:14px;padding:16px 20px;'>
      <summary itemprop='name' style='cursor:pointer;font-weight:600;font-size:clamp(16px,2.2vw,19px);line-height:1.45;'>Can Aenfinite help implement what I read here?</summary>
      <div itemscope itemprop='acceptedAnswer' itemtype='https://schema.org/Answer' style='margin-top:12px;'>
        <div itemprop='text' style='line-height:1.7;font-size:16px;opacity:0.85;'>Yes. If an article sparks an idea, book a free consultation and we will help you put it into action.</div>
      </div>
    </details>
    <details class='aen-faq-item' itemscope itemprop='mainEntity' itemtype='https://schema.org/Question' style='border:1px solid rgba(128,128,128,0.25);border-radius:12px;margin-bottom:14px;padding:16px 20px;'>
      <summary itemprop='name' style='cursor:pointer;font-weight:600;font-size:clamp(16px,2.2vw,19px);line-height:1.45;'>Can I share or reference your articles?</summary>
      <div itemscope itemprop='acceptedAnswer' itemtype='https://schema.org/Answer' style='margin-top:12px;'>
        <div itemprop='text' style='line-height:1.7;font-size:16px;opacity:0.85;'>Absolutely. Feel free to share with attribution and a link back to the original post.</div>
      </div>
    </details>
  </div>
</section>
<!-- AEN-FAQ END -->
`;

export default function Page() {
  return (
    <>
        <script
          key="schema-0"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Aenfinite® Blog",
        "description": "Expert insights on web design, logo design, digital marketing, and branding",
        "url": "https://aenfinite.us/blog/",
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
      "name": "Web Design & Digital Marketing Blog",
      "item": "https://aenfinite.us/blog/"
    }
  ]
}` }}
        />
      <HtmlPage content={pageContent} bodyClass={bodyClass} headStyles={headStyles} />
    </>
  );
}
