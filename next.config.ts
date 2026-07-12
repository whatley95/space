import type { NextConfig } from "next";

// Enable a static export only for Cloudflare builds (npm run build:cf),
// so the regular `next build` / `next start` keep working as a server build.
const isCloudflare = process.env.CF_BUILD === "1";

const nextConfig: NextConfig = {
  ...(isCloudflare ? { output: "export" } : {}),
};

export default nextConfig;
