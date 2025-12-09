// utils/cookies/deleteCookies.ts

/**
 * Comprehensive cookie deletion that works in all environments
 */
export const deleteCookies = (cookieNames: string[]) => {
  if (typeof document === 'undefined') return; // SSR safety check
  
  // Get current hostname for domain-specific clearing
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  cookieNames.forEach(name => {
    // Clear cookie with multiple variations to ensure deletion
    const cookieVariations = [
      // Basic clear
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
      
      // Clear with current path
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${window.location.pathname};`,
      
      // Clear with empty path
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
    ];
    
    // Add domain variations for production
    if (!isLocalhost) {
      cookieVariations.push(
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`
      );
    }
    
    // Add secure flag for HTTPS
    if (window.location.protocol === 'https:') {
      cookieVariations.push(
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure;`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict;`
      );
    }
    
    // Try all variations
    cookieVariations.forEach(cookieString => {
      document.cookie = cookieString;
    });
    
    // Also try to clear by setting empty value with Max-Age 0
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  });
  
  // Additional: Clear all visible cookies (backup method)
  const allCookies = document.cookie.split(';');
  allCookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0]?.trim();
    if (cookieName) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
};