export function extractTLD(hostname: string): string {
    // Split the hostname by dots
    const parts = hostname.split('.');
    
    // If we have two or fewer parts, return the whole hostname
    if (parts.length <= 2) {
        return hostname;
    }
    
    // For hostnames with more than two parts, return the last two parts
    return parts.slice(-2).join('.');
}

// Example usage:
// console.log(extractTLD('example.com')); // Output: example.com
// console.log(extractTLD('subdomain.example.com')); // Output: example.com
// console.log(extractTLD('sub.subdomain.example.co.uk')); // Output: co.uk