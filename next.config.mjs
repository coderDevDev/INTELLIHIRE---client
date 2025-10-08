/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  // Enable static export for Render.com
  output: 'export',
  trailingSlash: true,
  // Configure asset prefix for proper loading
  assetPrefix: '',
  // Disable static optimization for dynamic routes
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;
