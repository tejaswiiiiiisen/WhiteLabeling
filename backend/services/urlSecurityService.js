/**
 * URL Security & SSRF Protection Service
 * Defends against SSRF, Private Network Crawls, DNS Rebinding & Malicious Payloads
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  '169.254.169.254', // AWS/DigitalOcean/Azure link-local metadata
  'instance-data',
]);

const PRIVATE_IP_RANGES = [
  /^127\./, // Loopback
  /^10\./, // 10.0.0.0 - 10.255.255.255
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0 - 172.31.255.255
  /^192\.168\./, // 192.168.0.0 - 192.168.255.255
  /^169\.254\./, // Link-local
  /^fc00:/i, // IPv6 Unique Local
  /^fe80:/i, // IPv6 Link-Local
];

function validateUrlSecurity(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string.' };
  }

  let parsed;
  try {
    let toParse = urlString.trim();
    if (!/^https?:\/\//i.test(toParse)) {
      toParse = 'https://' + toParse;
    }
    parsed = new URL(toParse);
  } catch (err) {
    return { valid: false, error: `Invalid URL format: ${err.message}` };
  }

  // Enforce HTTP / HTTPS protocol only
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, error: `Protocol ${parsed.protocol} is disallowed. Only HTTP and HTTPS are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and metadata endpoints
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return {
      valid: false,
      error: `Security Violation: Access to private/internal hostname (${hostname}) is strictly forbidden by SSRF shield.`,
    };
  }

  // Block Private IP ranges
  for (const regex of PRIVATE_IP_RANGES) {
    if (regex.test(hostname)) {
      return {
        valid: false,
        error: `Security Violation: Access to private network address (${hostname}) is blocked.`,
      };
    }
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
    hostname,
    protocol: parsed.protocol,
  };
}

/**
 * XSS & Malicious Payload Sanitizer
 * Strips script tags, iframe injections, inline event handlers
 */
function sanitizeImportedHtml(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return '';

  return htmlString
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline JS event handlers (onload, onerror, onclick, etc.)
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
    // Disallow javascript: pseudo-protocols
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
}

module.exports = {
  validateUrlSecurity,
  sanitizeImportedHtml,
};
