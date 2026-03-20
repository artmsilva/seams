import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import seams from "@artmsilva/seams-vite-plugin";

export default defineConfig({
  base: "/seams/",
  plugins: [
    react(),
    seams({
      useScope: true,
      useLayers: true,
    }),
  ],
});
