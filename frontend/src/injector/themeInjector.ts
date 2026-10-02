import { TenantBrandingConfig } from '../types';

/**
 * Injects tenant-specific white-label properties directly into the DOM.
 * This applies seamlessly across Tailwind CSS, vanilla CSS, and browser metadata.
 */
export function applyTenantTheme(config: TenantBrandingConfig) {
  if (typeof window === 'undefined' || !config) return;

  const root = document.documentElement;

  // 1. Inject Theme Colors into CSS Custom Properties
  if (config.primaryColor) {
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--color-primary', config.primaryColor);
    root.style.setProperty('--brand-primary', config.primaryColor);
    root.style.setProperty('--brand-color', config.primaryColor);
    
    // Auto-generate a slightly darker hover shade if not provided
    root.style.setProperty('--primary-hover', adjustColor(config.primaryColor, -20));
  }

  if (config.secondaryColor) {
    root.style.setProperty('--secondary-color', config.secondaryColor);
    root.style.setProperty('--brand-secondary', config.secondaryColor);
  }

  if (config.accentColor) {
    root.style.setProperty('--accent-color', config.accentColor);
    root.style.setProperty('--brand-accent', config.accentColor);
  }

  if (config.sidebarBg) {
    root.style.setProperty('--sidebar-bg', config.sidebarBg);
  }

  if (config.textColor) {
    root.style.setProperty('--brand-text', config.textColor);
  }

  if (config.fontFamily) {
    root.style.setProperty('--brand-font', config.fontFamily);
  }

  // 2. Dynamically Inject / Update Browser Favicon
  if (config.faviconUrl) {
    updateFavicon(config.faviconUrl);
  }

  // 3. Dynamically Update Document Title & Meta
  if (config.metaTitle || config.companyName) {
    const title = config.metaTitle || config.companyName;
    document.title = title;
  }

  // 4. Inject Custom CSS if enabled
  if (config.customCss) {
    injectCustomCss(config.customCss);
  }
}

/**
 * Dynamically replace or create favicon <link> element
 */
function updateFavicon(url: string) {
  try {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;
  } catch (err) {
    console.warn('[Whitelabel] Could not update favicon:', err);
  }
}

/**
 * Inject tenant custom CSS block safely
 */
function injectCustomCss(cssString: string) {
  try {
    let styleTag = document.getElementById('whitelabel-custom-css');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'whitelabel-custom-css';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = cssString;
  } catch (err) {
    console.warn('[Whitelabel] Could not inject custom CSS:', err);
  }
}

/**
 * Lightweight helper to brighten/darken hex colors for hover states
 */
function adjustColor(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return hex;
  let num = parseInt(hex.slice(1), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
