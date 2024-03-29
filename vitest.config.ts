/// <reference types="vitest" />
/// <reference types="vite/client" />



import { configDefaults, } from 'vitest/config'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    exclude: [...configDefaults.exclude, 'app/models/*.server*'],
  },
});
