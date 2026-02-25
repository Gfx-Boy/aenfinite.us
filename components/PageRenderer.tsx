'use client';

import { useEffect, useRef } from 'react';

interface PageRendererProps {
  content: string;
  headStyles?: string;
  headScripts?: string;
  bodyClass?: string;
}

/**
 * PageRenderer - Renders raw HTML content and properly executes
 * inline scripts and loads external scripts. This is the core
 * component for migrating WordPress HTML pages to Next.js while
 * keeping everything pixel-perfect identical.
 */
export default function PageRenderer({ 
  content, 
  headStyles = '', 
  headScripts = '',
  bodyClass = '' 
}: PageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stylesInjectedRef = useRef(false);
  const scriptsInitializedRef = useRef(false);

  // Apply body class
  useEffect(() => {
    if (bodyClass) {
      // Parse and add relevant classes
      const classes = bodyClass.split(' ').filter(c => 
        c && c !== 'loading' // We'll handle loading state ourselves
      );
      classes.forEach(cls => document.body.classList.add(cls));
      
      // Add loading class initially for splash screen
      if (bodyClass.includes('loading')) {
        document.body.classList.add('loading');
      }
      
      return () => {
        classes.forEach(cls => document.body.classList.remove(cls));
      };
    }
  }, [bodyClass]);

  // Inject head styles
  useEffect(() => {
    if (headStyles && !stylesInjectedRef.current) {
      stylesInjectedRef.current = true;
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-page-styles', 'true');
      styleEl.textContent = headStyles;
      document.head.appendChild(styleEl);

      return () => {
        styleEl.remove();
        stylesInjectedRef.current = false;
      };
    }
  }, [headStyles]);

  // Process content: extract scripts, execute them in order
  useEffect(() => {
    if (!containerRef.current || scriptsInitializedRef.current) return;
    scriptsInitializedRef.current = true;

    const container = containerRef.current;

    // Find all script tags in the rendered content
    const scriptElements = container.querySelectorAll('script');
    const scripts: { src?: string; content?: string; id?: string }[] = [];

    scriptElements.forEach((script) => {
      if (script.type === 'application/ld+json') return; // Skip JSON-LD

      if (script.src) {
        scripts.push({ src: script.src, id: script.id });
      } else if (script.textContent && script.textContent.trim()) {
        scripts.push({ content: script.textContent, id: script.id });
      }
      // Remove the original script element (we'll re-create them)
      script.remove();
    });

    // Execute head scripts first
    if (headScripts) {
      try {
        const fn = new Function(headScripts);
        fn();
      } catch (e) {
        console.warn('Head scripts error:', e);
      }
    }

    // Load scripts sequentially
    let scriptIndex = 0;

    function loadNextScript() {
      if (scriptIndex >= scripts.length) return;

      const scriptDef = scripts[scriptIndex];
      scriptIndex++;

      if (scriptDef.src) {
        // External script - create and append
        const newScript = document.createElement('script');
        newScript.src = scriptDef.src;
        if (scriptDef.id) newScript.id = scriptDef.id;
        newScript.onload = loadNextScript;
        newScript.onerror = () => {
          console.warn(`Failed to load script: ${scriptDef.src}`);
          loadNextScript();
        };
        document.body.appendChild(newScript);
      } else if (scriptDef.content) {
        // Inline script - execute
        try {
          const fn = new Function(scriptDef.content);
          fn();
        } catch (e) {
          console.warn('Inline script error:', e);
        }
        loadNextScript();
      } else {
        loadNextScript();
      }
    }

    // Small delay to ensure DOM is ready
    setTimeout(loadNextScript, 100);

    return () => {
      scriptsInitializedRef.current = false;
    };
  }, [content, headScripts]);

  return (
    <div 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}
