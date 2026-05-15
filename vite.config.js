import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

let comfyTarget = process.env.COMFY_TARGET || "http://127.0.0.1:8000";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function isSafeLocalTarget(urlString) {
  try {
    const url = new URL(urlString);
    const hosts = new Set(["127.0.0.1", "localhost", "::1"]);
    return ["http:", "https:"].includes(url.protocol) && hosts.has(url.hostname);
  } catch {
    return false;
  }
}

function localControlPlugin() {
  return {
    name: "diffusiondesk-local-control",
    configureServer(server) {
      server.middlewares.use("/local/status", (req, res) => {
        sendJson(res, 200, { ok: true, comfyTarget, app: "DiffusionDesk" });
      });

      server.middlewares.use("/local/set-comfy-target", async (req, res) => {
        if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
        try {
          const parsed = JSON.parse((await readBody(req)) || "{}");
          const target = String(parsed.apiUrl || "").replace(/\/$/, "");
          if (!isSafeLocalTarget(target)) {
            return sendJson(res, 400, { error: "Invalid API URL. Only localhost targets are allowed, e.g. http://127.0.0.1:8000 or http://127.0.0.1:8188." });
          }
          comfyTarget = target;
          sendJson(res, 200, { ok: true, target: comfyTarget });
        } catch (error) {
          sendJson(res, 400, { error: String(error) });
        }
      });

      server.middlewares.use("/local/checkpoints", (req, res) => {
        try {
          const url = new URL(req.url, "http://localhost");
          const folder = url.searchParams.get("folder");
          if (!folder) return sendJson(res, 400, { error: "Missing folder parameter" });
          const resolved = path.resolve(folder);
          if (!fs.existsSync(resolved)) return sendJson(res, 200, { checkpoints: [], warning: "Folder does not exist", folder: resolved });
          if (!fs.statSync(resolved).isDirectory()) return sendJson(res, 400, { checkpoints: [], error: "Path is not a directory", folder: resolved });
          const allowed = new Set([".ckpt", ".safetensors", ".pt", ".pth"]);
          const files = fs.readdirSync(resolved).filter((f) => allowed.has(path.extname(f).toLowerCase())).sort((a, b) => a.localeCompare(b));
          sendJson(res, 200, { checkpoints: files, folder: resolved });
        } catch (error) {
          sendJson(res, 500, { error: String(error) });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localControlPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/comfy": {
        target: comfyTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/comfy/, ""),
        router: () => comfyTarget,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("origin");
            proxyReq.removeHeader("referer");
          });
          proxy.on("error", (err, req, res) => {
            if (!res.headersSent) res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: `ComfyUI proxy error: ${err.message}`, target: comfyTarget }));
          });
        },
      },
    },
  },
});
