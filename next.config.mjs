const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  trailingSlash: true,
  assetPrefix: '',
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;
