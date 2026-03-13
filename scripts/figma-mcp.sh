#!/bin/zsh

# Wrapper to export FIGMA_TOKEN and run the stdio MCP server

# Token provided by user - set FIGMA_TOKEN in your environment before running
export FIGMA_TOKEN="${FIGMA_TOKEN:-}"

# Default file key extracted from Figma URL
export FIGMA_FILE_KEY="0H5CB8E8OD00iHIgbAC2Jb"

DIR="$(cd "$(dirname "$0")" && pwd)"
node "$DIR/figma-mcp-server.js"


