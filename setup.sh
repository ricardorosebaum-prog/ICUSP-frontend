#!/bin/bash
# WebFrame Weaver - Setup Script (Linux/macOS)
# Execute este script após clonar o repositório para instalar dependências e iniciar dev

echo "====================================="
echo "WebFrame Weaver - Setup Script"
echo "====================================="

# Step 1: Check Node.js
echo ""
echo "[1/4] Checking Node.js..."
node_version=$(node --version)
npm_version=$(npm --version)
echo "Node.js: $node_version"
echo "npm: $npm_version"

# Step 2: Install dependencies
echo ""
echo "[2/4] Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "npm install failed!"
    exit 1
fi
echo "Dependencies installed successfully!"

# Step 3: Run linter
echo ""
echo "[3/4] Running linter..."
npm run lint 2>&1 > /dev/null
echo "Linter check complete"

# Step 4: Start dev server
echo ""
echo "[4/4] Starting development server..."
echo "The app will be available at http://localhost:5173"
echo "Press Ctrl+C to stop the server"
npm run dev
