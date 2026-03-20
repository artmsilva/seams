import type { NextConfig } from "next";
import { withSeams } from "@artmsilva/seams-next-plugin";

const nextConfig: NextConfig = process.env.DEPLOY_BASE
  ? { output: "export", basePath: process.env.DEPLOY_BASE }
  : {};

export default withSeams({
  useScope: true,
  useLayers: true,
})(nextConfig);
