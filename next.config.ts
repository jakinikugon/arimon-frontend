import type { NextConfig } from "next";

import { EnvConfig } from "./lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [new URL(EnvConfig.api.backend).hostname],
  },
};

export default nextConfig;
