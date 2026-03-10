#!/usr/bin/env node
"use strict";

// Minimal Figma MCP stdio server using the MCP SDK.
// Exposes tools: getFile, getComponents, getStyles, getNodes, getImages.

const { Server } = require("@modelcontextprotocol/sdk/server/server");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio");

const FIGMA_API_BASE = "https://api.figma.com/v1";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function figmaFetch(path, init = {}) {
  const token = requireEnv("FIGMA_TOKEN");
  const url = `${FIGMA_API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      // Figma supports either Authorization: Bearer or X-Figma-Token; use explicit header
      "X-Figma-Token": token,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Figma API ${res.status} ${res.statusText}: ${text}`);
  }
  // Some endpoints return binary; default to JSON with fallback to text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

function asTextContent(data) {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return { content: [{ type: "text", text }] };
}

async function main() {
  const server = new Server({ name: "figma-mcp", version: "0.1.0" });
  const transport = new StdioServerTransport();

  // getFile
  server.tool(
    {
      name: "getFile",
      description: "Fetch Figma file JSON by file key",
      inputSchema: {
        type: "object",
        properties: {
          fileKey: { type: "string", description: "Figma file key" },
        },
        required: ["fileKey"],
        additionalProperties: false,
      },
    },
    async ({ input }) => {
      const { fileKey } = input;
      const data = await figmaFetch(`/files/${encodeURIComponent(fileKey)}`);
      return asTextContent(data);
    }
  );

  // getComponents
  server.tool(
    {
      name: "getComponents",
      description: "List published components in a file",
      inputSchema: {
        type: "object",
        properties: {
          fileKey: { type: "string", description: "Figma file key" },
        },
        required: ["fileKey"],
        additionalProperties: false,
      },
    },
    async ({ input }) => {
      const { fileKey } = input;
      const data = await figmaFetch(`/files/${encodeURIComponent(fileKey)}/components`);
      return asTextContent(data);
    }
  );

  // getStyles
  server.tool(
    {
      name: "getStyles",
      description: "List published styles in a file",
      inputSchema: {
        type: "object",
        properties: {
          fileKey: { type: "string", description: "Figma file key" },
        },
        required: ["fileKey"],
        additionalProperties: false,
      },
    },
    async ({ input }) => {
      const { fileKey } = input;
      const data = await figmaFetch(`/files/${encodeURIComponent(fileKey)}/styles`);
      return asTextContent(data);
    }
  );

  // getNodes
  server.tool(
    {
      name: "getNodes",
      description: "Fetch specific node(s) by ID(s)",
      inputSchema: {
        type: "object",
        properties: {
          fileKey: { type: "string", description: "Figma file key" },
          ids: {
            type: "array",
            items: { type: "string" },
            description: "Array of node IDs",
          },
        },
        required: ["fileKey", "ids"],
        additionalProperties: false,
      },
    },
    async ({ input }) => {
      const { fileKey, ids } = input;
      const data = await figmaFetch(
        `/files/${encodeURIComponent(fileKey)}/nodes?ids=${encodeURIComponent(ids.join(","))}`
      );
      return asTextContent(data);
    }
  );

  // getImages
  server.tool(
    {
      name: "getImages",
      description: "Get image URLs for node(s)",
      inputSchema: {
        type: "object",
        properties: {
          fileKey: { type: "string", description: "Figma file key" },
          ids: {
            type: "array",
            items: { type: "string" },
            description: "Array of node IDs",
          },
          format: {
            type: "string",
            enum: ["png", "jpg", "svg", "pdf"],
            description: "Export format",
          },
          scale: {
            type: "number",
            description: "Image scale (1..3)",
          },
        },
        required: ["fileKey", "ids"],
        additionalProperties: false,
      },
    },
    async ({ input }) => {
      const { fileKey, ids, format, scale } = input;
      const params = new URLSearchParams();
      params.set("ids", ids.join(","));
      if (format) params.set("format", format);
      if (scale) params.set("scale", String(scale));
      const data = await figmaFetch(
        `/images/${encodeURIComponent(fileKey)}?${params.toString()}`
      );
      return asTextContent(data);
    }
  );

  await server.connect(transport);
}

main().catch((err) => {
  // Emit a single-line error to stderr and exit non-zero
  const msg = (err && err.stack) || String(err);
  process.stderr.write(msg + "\n");
  process.exit(1);
});


