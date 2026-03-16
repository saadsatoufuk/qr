/**
 * Extract the tenant (subdomain) from a hostname.
 *
 * Examples:
 *   mohammed.intilaq.com  → "mohammed"
 *   salem.intilaq.com     → "salem"
 *   localhost:3000         → "localhost"   (dev fallback)
 *   app.localhost:3000     → "app"         (dev subdomain)
 */
export function getTenant(host: string | null): string {
  if (!host) return '';

  // Strip port
  const hostname = host.split(':')[0];

  // localhost — treat as single dev tenant unless there's a subdomain like app.localhost
  if (hostname === 'localhost') return 'localhost';
  if (hostname.endsWith('.localhost')) return hostname.replace('.localhost', '');

  const parts = hostname.split('.');

  // e.g. mohammed.intilaq.com → ["mohammed", "intilaq", "com"]
  if (parts.length >= 3) return parts[0];

  // e.g. intilaq.com (bare domain, no subdomain)
  return hostname;
}
