'use client';

import { useEffect, useRef, useCallback } from 'react';

interface HtmlPageProps {
  content: string;
  bodyClass?: string;
  headStyles?: string;
  /** If set, replaces the default theme CSS (mainf1a7.css) with this file */
  overrideCss?: string;
}

/**
 * HtmlPage - Renders raw HTML content with proper script execution.
 * 
 * This component:
 * 1. Injects page-specific styles into <head> BEFORE external CSS (preserves cascade order)
 * 2. Renders HTML via dangerouslySetInnerHTML
 * 3. Applies body classes (document, loading, etc.)
 * 4. Extracts and re-executes all <script> tags in proper order
 * 5. Handles both inline and external scripts
 */
export default function HtmlPage({ content, bodyClass = '', headStyles = '', overrideCss = '' }: HtmlPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Override theme CSS if needed (e.g., darkmode uses main8783.css instead of mainf1a7.css)
  useEffect(() => {
    if (!overrideCss) return;
    
    // Find and disable ALL default theme CSS links (both preload and stylesheet)
    const defaultCssLinks = document.head.querySelectorAll('link[href*="mainf1a7"]') as NodeListOf<HTMLLinkElement>;
    const defaultStyleLinks = document.head.querySelectorAll('link[href*="stylef1a7"]') as NodeListOf<HTMLLinkElement>;
    
    defaultCssLinks.forEach(link => { link.disabled = true; link.setAttribute('data-disabled-by-override', 'true'); });
    defaultStyleLinks.forEach(link => { link.disabled = true; link.setAttribute('data-disabled-by-override', 'true'); });
    
    // Add the override CSS
    const overrideLink = document.createElement('link');
    overrideLink.rel = 'stylesheet';
    overrideLink.type = 'text/css';
    overrideLink.href = overrideCss;
    overrideLink.setAttribute('data-override-css', 'true');
    document.head.appendChild(overrideLink);
    
    return () => {
      // Re-enable default CSS and remove override when leaving this page
      defaultCssLinks.forEach(link => { link.disabled = false; link.removeAttribute('data-disabled-by-override'); });
      defaultStyleLinks.forEach(link => { link.disabled = false; link.removeAttribute('data-disabled-by-override'); });
      overrideLink.remove();
    };
  }, [overrideCss]);

  // Inject page-specific styles into <head> BEFORE external CSS
  // This preserves the original cascade order where inline styles
  // appeared before the external mainf1a7.css
  useEffect(() => {
    if (!headStyles) return;
    
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-page-styles', 'true');
    styleEl.textContent = headStyles;
    
    // Insert BEFORE the first <link> stylesheet to match original cascade order
    const firstLink = document.head.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      document.head.insertBefore(styleEl, firstLink);
    } else {
      document.head.appendChild(styleEl);
    }
    
    return () => {
      styleEl.remove();
    };
  }, [headStyles]);

  // Apply body class immediately on mount
  useEffect(() => {
    if (!bodyClass) return;
    
    const classes = bodyClass.split(/\s+/).filter(Boolean);
    const hasLoading = classes.includes('loading');
    classes.forEach(cls => document.body.classList.add(cls));
    
    // Safety: if page has 'loading' class (homepage splash),
    // ensure it eventually becomes visible even if animation fails
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;
    if (hasLoading) {
      safetyTimer = setTimeout(() => {
        document.body.classList.remove('body_hide', 'loading');
        document.body.style.opacity = '1';
      }, 10000); // 10s safety for splash animation (normally 7s)
    }
    
    return () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      classes.forEach(cls => document.body.classList.remove(cls));
      document.body.style.opacity = '';
    };
  }, [bodyClass]);

  // Execute scripts after content is rendered
  const executeScripts = useCallback(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    // Re-dispatch DOMContentLoaded so inline scripts that listen for it will fire
    // (the real event already fired before React mounted)
    setTimeout(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }, 200);

    const container = containerRef.current;
    const allScripts = container.querySelectorAll('script');
    
    // Collect all scripts in order
    const scriptQueue: Array<{
      src?: string;
      content?: string;
      id?: string;
      type?: string;
      async?: boolean;
    }> = [];

    allScripts.forEach((script) => {
      // Skip JSON-LD - those are handled by Next.js metadata
      if (script.type === 'application/ld+json') return;
      
      const entry: any = {
        id: script.id || undefined,
        type: script.type || undefined,
        async: script.async,
      };

      if (script.src) {
        entry.src = script.src;
      } else if (script.textContent && script.textContent.trim().length > 0) {
        entry.content = script.textContent;
      }

      scriptQueue.push(entry);
      // Remove the original non-executing script element
      script.remove();
    });

    // Execute scripts sequentially
    let index = 0;

    function next() {
      if (index >= scriptQueue.length) return;
      
      const scriptDef = scriptQueue[index++];

      if (scriptDef.src) {
        // Skip scripts already loaded by layout.tsx
        const alreadyLoaded = [
          'jquery.min.js',
          'slick.min.js', 
          'smartScroll.min.js',
          'gsap.min.js',
          'ScrollMagic.js',
          'ScrollMagic',
          'animation.gsap.js',
          'demo5163.js',
          'aos.js',
          'button-highlights.js',
          'custom-form-handler.js',
          'gtag/js',
          'googletagmanager.com',
          'hooks.min',
          'i18n.min',
          'swv/js',
          'clearbitscripts.com',
          'acsbapp.com',
          'licdn.com',
          'snap.licdn.com',
        ];
        
        const shouldSkip = alreadyLoaded.some(name => scriptDef.src!.includes(name));
        if (shouldSkip) {
          next();
          return;
        }

        // Load external script
        const newScript = document.createElement('script');
        newScript.src = scriptDef.src;
        if (scriptDef.id) newScript.id = scriptDef.id;
        if (scriptDef.async) newScript.async = true;
        newScript.onload = next;
        newScript.onerror = () => {
          console.warn(`Script load failed: ${scriptDef.src}`);
          next();
        };
        document.body.appendChild(newScript);
      } else if (scriptDef.content) {
        // Execute inline script
        try {
          const newScript = document.createElement('script');
          newScript.textContent = scriptDef.content;
          document.body.appendChild(newScript);
        } catch (e) {
          console.warn('Inline script error:', e);
        }
        // Use setTimeout to allow the script to settle before next
        setTimeout(next, 10);
      } else {
        next();
      }
    }

    // Start execution after a small delay to ensure DOM is fully painted
    setTimeout(next, 50);
  }, []);

  useEffect(() => {
    executeScripts();
    
    return () => {
      initializedRef.current = false;
    };
  }, [executeScripts]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
