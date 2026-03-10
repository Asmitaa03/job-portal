#!/usr/bin/env -S node --enable-source-maps

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const FIGMA_API_BASE = "https://api.figma.com/v1";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

async function figmaFetch(relative: string): Promise<any> {
  const token = requireEnv("FIGMA_TOKEN");
  const url = `${FIGMA_API_BASE}${relative}`;
  const res = await fetch(url, {
    headers: {
      "X-Figma-Token": token,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Figma ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

async function main() {
  const fileKey = process.env.FIGMA_FILE_KEY || requireEnv("FIGMA_FILE_KEY");
  // __dirname is not defined in ESM; reconstruct it
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.resolve(__dirname, "../figma");
  fs.mkdirSync(outDir, { recursive: true });

  const [fileJson, stylesJson, componentsJson] = await Promise.all([
    figmaFetch(`/files/${encodeURIComponent(fileKey)}`),
    figmaFetch(`/files/${encodeURIComponent(fileKey)}/styles`),
    figmaFetch(`/files/${encodeURIComponent(fileKey)}/components`),
  ]);

  // Variables endpoint
  let variablesJson: any = null;
  try {
    variablesJson = await figmaFetch(`/files/${encodeURIComponent(fileKey)}/variables`);
  } catch (e) {
    variablesJson = { error: String(e) };
  }

  fs.writeFileSync(path.join(outDir, "file.json"), JSON.stringify(fileJson, null, 2));
  fs.writeFileSync(path.join(outDir, "styles.json"), JSON.stringify(stylesJson, null, 2));
  fs.writeFileSync(path.join(outDir, "components.json"), JSON.stringify(componentsJson, null, 2));
  fs.writeFileSync(path.join(outDir, "variables.json"), JSON.stringify(variablesJson, null, 2));

  console.log("Saved figma data to:", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


