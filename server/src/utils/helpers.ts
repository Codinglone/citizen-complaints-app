/**
 * Generate a unique tracking code for complaints
 * @param prefix Prefix to use for the tracking code (e.g., 'CMP', 'ANO')
 * @returns A tracking code string
 */
export function generateTrackingCode(prefix: string): string {
  // Get current date components
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Generate a random 6-digit number
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  // Combine components to create the tracking code
  return `${prefix}-${year}${month}${day}-${random}`;
}