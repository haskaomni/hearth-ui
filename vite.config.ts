import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

// Library build: ESM + CJS + .d.ts + a single styles.css
export default defineConfig({
  plugins: [react(), dts({ include: ["src"], rollupTypes: true, tsconfigPath: "./tsconfig.json" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
      // Mark the bundle as client components for Next.js App Router.
      output: { banner: '"use client";' },
    },
    sourcemap: true,
  },
});
