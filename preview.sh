#!/bin/bash

# Preview link script for website
# This script starts the dev server (if not running) and creates a Cloudflare Tunnel preview link
# Both run in the background so updates are visible in real-time

set -e

PORT=5000
HOST="127.0.0.1"
SERVER_PID_FILE="dev_server.pid"

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
        if [ $port -gt 65535 ]; then
            echo "No available ports found" >&2
            exit 1
        fi
    done
    echo $port
}

# Function to cleanup on exit
cleanup() {
    if [ -f "$SERVER_PID_FILE" ]; then
        SERVER_PID=$(cat "$SERVER_PID_FILE")
        if kill -0 $SERVER_PID 2>/dev/null; then
            echo "Stopping dev server (PID: $SERVER_PID)..."
            kill $SERVER_PID 2>/dev/null || true
        fi
        rm -f "$SERVER_PID_FILE"
    fi
    if [ -f cf_tunnel.pid ]; then
        TUNNEL_PID=$(cat cf_tunnel.pid)
        if kill -0 $TUNNEL_PID 2>/dev/null; then
            echo "Stopping tunnel (PID: $TUNNEL_PID)..."
            kill $TUNNEL_PID 2>/dev/null || true
        fi
        rm -f cf_tunnel.pid
    fi
}

trap cleanup EXIT INT TERM

# Check if server is already running
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    # Check if it's actually our server by testing the health endpoint
    if curl -s http://$HOST:$PORT/health > /dev/null 2>&1; then
        echo "✓ Server is already running on port $PORT"
        SERVER_PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t | head -1)
        echo $SERVER_PID > "$SERVER_PID_FILE"
    else
        # Port is taken by something else, find a new port
        echo "⚠️  Port $PORT is in use by another process, finding available port..."
        PORT=$(find_available_port $PORT)
        echo "Using port $PORT instead"
    fi
fi

# Start server if not already running on the determined port
if ! curl -s http://$HOST:$PORT/health > /dev/null 2>&1; then
    echo "Starting dev server on port $PORT in background..."
    PORT=$PORT npm run dev > dev.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > "$SERVER_PID_FILE"
    echo "Server started with PID: $SERVER_PID"
    
    # Wait for server to be ready and detect actual port
    echo "Waiting for server to be ready..."
    ACTUAL_PORT=$PORT
    for i in {1..30}; do
        # Try to detect the actual port from the log
        if [ -f dev.log ]; then
            LOG_PORT=$(grep -o "serving on http://[^:]*:[0-9]*" dev.log | grep -o "[0-9]*" | tail -1)
            if [ -n "$LOG_PORT" ]; then
                ACTUAL_PORT=$LOG_PORT
            fi
        fi
        
        if curl -s http://$HOST:$ACTUAL_PORT/health > /dev/null 2>&1; then
            PORT=$ACTUAL_PORT
            echo "✓ Server is ready on port $PORT!"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "✗ Server failed to start after 30 seconds"
            echo "Check dev.log for errors:"
            tail -20 dev.log
            cleanup
            exit 1
        fi
        sleep 1
    done
else
    # Server already running, detect its port
    ACTUAL_PORT=$(lsof -Pi -sTCP:LISTEN | grep -E "tsx|node" | grep -o ":[0-9]*" | head -1 | tr -d ':')
    if [ -n "$ACTUAL_PORT" ]; then
        PORT=$ACTUAL_PORT
    fi
    echo "✓ Using existing server on port $PORT"
fi

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "Installing cloudflared..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install cloudflare/cloudflare/cloudflared || {
            echo "Please install cloudflared manually:"
            echo "  brew install cloudflare/cloudflare/cloudflared"
            echo "  or download from: https://github.com/cloudflare/cloudflared/releases"
            exit 1
        }
    else
        echo "Please install cloudflared manually:"
        echo "  Visit: https://github.com/cloudflare/cloudflared/releases"
        exit 1
    fi
fi

# Kill any existing tunnel
if [ -f cf_tunnel.pid ]; then
    OLD_PID=$(cat cf_tunnel.pid)
    if kill -0 $OLD_PID 2>/dev/null; then
        echo "Stopping existing tunnel (PID: $OLD_PID)..."
        kill $OLD_PID 2>/dev/null || true
    fi
    rm -f cf_tunnel.pid
fi

# Start Cloudflare Tunnel
echo "Creating Cloudflare Tunnel preview link..."
echo "This may take a few seconds..."

cloudflared tunnel --url http://$HOST:$PORT > cf_tunnel.log 2>&1 &
TUNNEL_PID=$!
echo $TUNNEL_PID > cf_tunnel.pid

# Wait a moment for tunnel to initialize
sleep 3

# Extract the preview URL from the log
TUNNEL_URL=$(grep -o 'https://[^ ]*\.trycloudflare\.com' cf_tunnel.log | head -1)

if [ -z "$TUNNEL_URL" ]; then
    echo "Waiting for tunnel URL..."
    sleep 2
    TUNNEL_URL=$(grep -o 'https://[^ ]*\.trycloudflare\.com' cf_tunnel.log | head -1)
fi

if [ -n "$TUNNEL_URL" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  ✓ Preview link created successfully!"
    echo ""
    echo "  🌐 Preview URL: $TUNNEL_URL"
    echo ""
    echo "  📝 Both dev server and tunnel are running in the background"
    echo "  🔄 Changes will be reflected automatically (hot-reload enabled)"
    echo ""
    echo "  📋 Server PID: $SERVER_PID (saved in dev_server.pid)"
    echo "  📋 Tunnel PID: $TUNNEL_PID (saved in cf_tunnel.pid)"
    echo ""
    echo "  🛑 To stop everything, run: npm run stop-preview"
    echo "  📝 Or press Ctrl+C in this terminal"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Preview is running! Make changes to your code and they'll appear in the preview."
    echo "Press Ctrl+C to stop the preview..."
    echo ""
    
    # Keep the script running so the trap can cleanup on exit
    # Monitor the processes and wait
    while true; do
        # Check if server is still running
        if ! kill -0 $SERVER_PID 2>/dev/null; then
            echo "⚠️  Dev server stopped unexpectedly"
            break
        fi
        # Check if tunnel is still running
        if ! kill -0 $TUNNEL_PID 2>/dev/null; then
            echo "⚠️  Tunnel stopped unexpectedly"
            break
        fi
        sleep 5
    done
else
    echo "⚠️  Could not extract tunnel URL from log. Check cf_tunnel.log for details."
    echo "Tunnel PID: $TUNNEL_PID"
fi

