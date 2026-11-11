import os, { type NetworkInterfaceInfo } from "node:os";
import type { NextConfig } from "next";

/* Keep phone/LAN previews working without manually editing this file when the
   router hands out a new IPv4 address. Only used by `next dev`. */
const lanOrigins = Object.values(os.networkInterfaces())
  .flat()
  .filter(
    (entry): entry is NetworkInterfaceInfo =>
      entry !== undefined && entry.family === "IPv4" && !entry.internal,
  )
  .map((entry) => entry.address);

const nextConfig: NextConfig = {
  // The Docker builder sets BUILD_STANDALONE=1. Local `npm run build` keeps
  // the default output so `npm run start` remains the normal Node workflow.
  ...(process.env.BUILD_STANDALONE === "1"
    ? { output: "standalone" as const }
    : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", ...lanOrigins],
};

export default nextConfig;
