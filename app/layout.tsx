import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aenfinite.us'),
  title: {
    default: 'Aenfinite® | Professional Digital Innovation Agency',
    template: '%s | Aenfinite®',
  },
  description: 'Aenfinite® is a professional digital innovation agency in United States specializing in custom web design, brand identity, UI/UX design, digital marketing, e-commerce development, and comprehensive digital transformation solutions.',
  icons: {
    icon: [
      { url: '/wp-content/themes/aenfinite.us/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/wp-content/themes/aenfinite.us/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/wp-content/themes/aenfinite.us/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: '/wp-content/themes/aenfinite.us/favicon/favicon.ico',
  },
  manifest: '/wp-content/themes/aenfinite.us/favicon/site.webmanifest',
  openGraph: {
    siteName: 'Aenfinite',
    images: [{
      url: 'https://aenfinite.us/wp-content/themes/aenfinite.us/images/thumbnail.jpg',
      width: 1200,
      height: 630,
      alt: 'Aenfinite Digital Innovation Agency',
    }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <head>
        {/* DNS prefetch & preconnect for speed */}

        {/* HREFLANG TAGS - Global language alternates */}
        <link rel="alternate" hrefLang="x-default" href="https://aenfinite.us/" />
        <link rel="alternate" hrefLang="en" href="https://aenfinite.us/" />
        <link rel="alternate" hrefLang="es" href="https://aenfinite.us/es/" />
        <link rel="alternate" hrefLang="fr" href="https://aenfinite.us/fr/" />
        <link rel="alternate" hrefLang="de" href="https://aenfinite.us/de/" />
        <link rel="alternate" hrefLang="it" href="https://aenfinite.us/it/" />
        <link rel="alternate" hrefLang="ar" href="https://aenfinite.us/ar/" />
        <link rel="alternate" hrefLang="pt" href="https://aenfinite.us/pt/" />
        <link rel="alternate" hrefLang="zh" href="https://aenfinite.us/zh/" />
        <link rel="alternate" hrefLang="hi" href="https://aenfinite.us/hi/" />
        <link rel="alternate" hrefLang="nl" href="https://aenfinite.us/nl/" />
        <link rel="alternate" hrefLang="ja" href="https://aenfinite.us/ja/" />
        <link rel="alternate" hrefLang="ko" href="https://aenfinite.us/ko/" />
        {/* END HREFLANG */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://acsbapp.com" />
        <link rel="dns-prefetch" href="https://tag.clearbitscripts.com" />

        {/* Google Fonts with display=swap for fast text render */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Critical CSS preloaded, then applied */}
        <link
          rel="preload"
          href="/wp-content/themes/aenfinite.us/static/css/mainf1a7.css?v=20250731-2020"
          as="style"
        />
        <link
          href="/wp-content/themes/aenfinite.us/static/css/mainf1a7.css?v=20250731-2020"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="preload"
          href="/wp-content/themes/aenfinite.us/stylef1a7.css?v=20250731-2020"
          as="style"
        />
        <link
          href="/wp-content/themes/aenfinite.us/stylef1a7.css?v=20250731-2020"
          rel="stylesheet"
          type="text/css"
        />

                {/* Font Awesome for lightbox nav icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Minor CSS – load non-blocking */}
        <link
          rel="stylesheet"
          id="classic-theme-styles-css"
          href="/wp-includes/css/classic-themes.mind1c0.css?ver=6.7.2"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <link
          rel="stylesheet"
          id="contact-form-7-css"
          href="/wp-content/plugins/contact-form-7/includes/css/stylesfc7a.css?ver=6.0.6"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
      </head>
      <body>
        {children}

        {/* Core JavaScript Libraries – afterInteractive to not block first paint */}
        <Script
          src="/wp-content/themes/aenfinite.us/static/js/jquery.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/wp-content/themes/aenfinite.us/static/js/slick.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/wp-content/themes/aenfinite.us/static/js/gsap.min.js"
          strategy="afterInteractive"
        />
        {/* ScrollMagic, animation.gsap, smartScroll removed – not used by any page */}

        {/* Google Analytics – lazyOnload so it never blocks page interaction */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-US00000001"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-US00000001');
          `}
        </Script>

        {/* GTM – lazyOnload */}
        <Script id="gtm" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-53L4TW5R');
          `}
        </Script>

        {/* Accessibility Widget */}
        <Script id="accessibility-widget" strategy="lazyOnload">
          {`
            (function(){
              var s = document.createElement('script');
              var h = document.querySelector('head') || document.body;
              s.src = 'https://acsbapp.com/apps/app/dist/js/app.js';
              s.async = true;
              s.onload = function(){
                acsbJS.init({
                  statementLink: '',
                  footerHtml: 'Web Accessibility Powered by Aenfinite® with ❤️',
                  hideMobile: false, hideTrigger: false, disableBgProcess: false,
                  language: 'en', position: 'left', leadColor: '#000000',
                  triggerColor: '#050505', triggerRadius: '10px',
                  triggerPositionX: 'left', triggerPositionY: 'bottom',
                  triggerIcon: 'display', triggerSize: 'small',
                  triggerOffsetX: 40, triggerOffsetY: 40,
                  mobile: { triggerSize: 'small', triggerPositionX: 'right',
                    triggerPositionY: 'center', triggerOffsetX: 10, triggerOffsetY: 0,
                    triggerRadius: '50%' }
                });
              };
              h.appendChild(s);
            })();
          `}
        </Script>

        {/* Clearbit */}
        <Script 
          src="https://tag.clearbitscripts.com/v1/pk_08e6c6ce3b014e610695b74a91741212/tags.js" 
          strategy="lazyOnload"
        />

        {/* Page functionality */}
        <Script
          src="/wp-content/themes/aenfinite.us/static/js/demo5163.js?v=20241204-0018"
          strategy="afterInteractive"
        />
        <Script
          src="/wp-content/themes/aenfinite.us/static/js/aos.js"
          strategy="afterInteractive"
        />

        {/* AOS Init */}
        <Script id="aos-init" strategy="afterInteractive">
          {`
            if (typeof $ !== 'undefined') {
              $(function() { if (typeof AOS !== 'undefined') AOS.init(); });
            } else {
              document.addEventListener('DOMContentLoaded', function() {
                if (typeof AOS !== 'undefined') AOS.init();
              });
            }
          `}
        </Script>

        {/* Button highlights & Form handler */}
        <Script src="/js/button-highlights.js" strategy="afterInteractive" />
        <Script src="/js/custom-form-handler.js" strategy="afterInteractive" />

        {/* WordPress CF7 – lazyOnload since forms aren't the first interaction */}
        <Script src="/wp-includes/js/dist/hooks.min4fdd.js?ver=4d63a3d491d11ffd8ac6" strategy="lazyOnload" id="wp-hooks-js" />
        <Script src="/wp-includes/js/dist/i18n.minc33c.js?ver=5e580eb46a90c2b997e6" strategy="lazyOnload" id="wp-i18n-js" />
        <Script src="/wp-content/plugins/contact-form-7/includes/swv/js/indexfc7a.js?ver=6.0.6" strategy="lazyOnload" id="swv-js" />
        <Script id="wpcf7-config" strategy="lazyOnload">
          {`var wpcf7 = {"api":{"root":"https://aenfinite.us/wp-json/","namespace":"contact-form-7/v1"},"cached":1};`}
        </Script>

        {/* LinkedIn Insight */}
        <Script id="linkedin-insight" strategy="lazyOnload">
          {`
            (function(l) {
              if (!l) { window.lintrk = function(a,b) { window.lintrk.q.push([a,b]); }; window.lintrk.q = []; }
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript"; b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      </body>
    </html>
  );
}
