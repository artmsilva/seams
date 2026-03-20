import type { NextConfig } from "next";
import { withSeams } from "@artmsilva/seams-next-plugin";

const nextConfig: NextConfig = {};

export default withSeams({
  useScope: true,
  useLayers: true,
})(nextConfig);
