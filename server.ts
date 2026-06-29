import { app } from "./api/index";
import express from "express";
import path from "path";
import fs from "fs";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  // Try to find the root directory reliably
  const rootDir = typeof __dirname !== "undefined" 
    ? (__dirname.includes('dist') ? path.join(__dirname, '..') : __dirname)
    : process.cwd();

  // Auto-migrate icons
  try {
    const generatedIconPath = path.join(rootDir, 'src', 'assets', 'images', 'logo_kivo_png_1781541028660.jpg');
    if (fs.existsSync(generatedIconPath)) {
      console.log(`[PWA Icon Migrator] Found high quality generated icon at ${generatedIconPath}`);
      const publicDir = path.join(rootDir, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      // Copy to public folder
      fs.copyFileSync(generatedIconPath, path.join(publicDir, 'logo_kivo_192.png'));
      fs.copyFileSync(generatedIconPath, path.join(publicDir, 'logo_kivo_512.png'));
      console.log(`[PWA Icon Migrator] Copied to public/ successfully.`);
    }
  } catch (e) {
    console.error("[PWA Icon Migrator] Error migrating icons:", e);
  }

  let isProduction = process.env.NODE_ENV === "production";

  // Robust production mode check:
  if (!isProduction) {
    try {
      if (typeof __dirname !== "undefined" && (__dirname.includes('dist') || __dirname.includes('build'))) {
        isProduction = true;
      }
    } catch (e) {}
  }

  if (!isProduction) {
    console.log("[SERVER] Starting in DEVELOPMENT mode...");
    const viteModule = "vite";
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    const handleHtmlWithManifestDev = async (req: any, res: any, next: any) => {
      try {
        const indexHtmlPath = path.resolve(rootDir, 'index.html');
        if (fs.existsSync(indexHtmlPath)) {
          let html = fs.readFileSync(indexHtmlPath, 'utf-8');
          html = await vite.transformIndexHtml(req.originalUrl, html);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    };

    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.includes('.')) return next();
      await handleHtmlWithManifestDev(req, res, next);
    });
  } else {
    console.log("[SERVER] Starting in PRODUCTION mode...");
    
    // Resolve dist folder
    let distPath = path.join(rootDir, 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      // If we are in dist/server.cjs, the index.html is in the same folder
      distPath = rootDir; 
    }

    console.log(`[SERVER] Serving static production files from: ${distPath}`);

    const handleHtmlWithManifestProd = (req: any, res: any, next: any) => {
      const targetPath = path.join(distPath, 'index.html');
      if (fs.existsSync(targetPath)) {
        let html = fs.readFileSync(targetPath, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
      } else {
        res.status(404).send("Frontend assets not found. Please run 'npm run build' first.");
      }
    };

    app.use(express.static(distPath, { index: false }));
    
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.includes('.')) return next();
      handleHtmlWithManifestProd(req, res, next);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] KIVO BARBER rodando com sucesso na porta ${PORT}`);
  });
}

startServer();

export default app;
