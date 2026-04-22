import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Lottery/",
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    globals: true
  }
});
