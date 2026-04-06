import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { ProxyOptions } from "vite";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const yelpKey = env.VITE_YELP_API_KEY ?? "";

  const yelpProxy: ProxyOptions = {
    target: "https://api.yelp.com",
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/yelp-api/, ""),
    configure(proxy) {
      proxy.on("proxyReq", (proxyReq) => {
        if (yelpKey) proxyReq.setHeader("Authorization", `Bearer ${yelpKey}`);
        proxyReq.setHeader("Accept", "application/json");
      });
    },
  };

  const nominatimProxy: ProxyOptions = {
    target: "https://nominatim.openstreetmap.org",
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/nominatim/, ""),
    configure(proxy) {
      proxy.on("proxyReq", (proxyReq) => {
        proxyReq.setHeader("User-Agent", "CityEatsExplorer/1.0 (local-dev)");
      });
    },
  };

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/yelp-api": yelpProxy,
        "/nominatim": nominatimProxy,
      },
    },
    preview: {
      proxy: {
        "/yelp-api": yelpProxy,
        "/nominatim": nominatimProxy,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
