import type { NextConfig } from "next";
import { withStitchesRSC } from "@stitches-rsc/next-plugin";

const nextConfig: NextConfig = {};

export default withStitchesRSC({
  useScope: true,
  useLayers: true,
})(nextConfig);
