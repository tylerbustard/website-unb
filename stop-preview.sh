#!/bin/bash

# Stop preview script - kills both the dev server and Cloudflare tunnel

SERVER_PID_FILE="dev_server.pid"

# Stop dev server
if [ -f "$SERVER_PID_FILE" ]; then
    PID=$(cat "$SERVER_PID_FILE")
    if kill -0 $PID 2>/dev/null; then
        echo "Stopping dev server (PID: $PID)..."
        kill $PID 2>/dev/null || true
        rm -f "$SERVER_PID_FILE"
        echo "✓ Dev server stopped"
    else
        echo "Dev server process not found, removing stale PID file"
        rm -f "$SERVER_PID_FILE"
    fi
else
    echo "No dev server PID file found."
fi

# Stop tunnel
if [ -f cf_tunnel.pid ]; then
    PID=$(cat cf_tunnel.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "Stopping Cloudflare tunnel (PID: $PID)..."
        kill $PID 2>/dev/null || true
        rm -f cf_tunnel.pid
        echo "✓ Tunnel stopped"
    else
        echo "Tunnel process not found, removing stale PID file"
        rm -f cf_tunnel.pid
    fi
else
    echo "No tunnel PID file found."
fi

# Also kill any remaining processes
pkill -f "cloudflared tunnel" 2>/dev/null || true
pkill -f "tsx server/index.ts" 2>/dev/null || true

echo ""
echo "✓ Preview stopped. All processes terminated."

