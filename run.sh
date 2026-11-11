#!/usr/bin/env bash
# run.sh
set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"

find_free_port() {
  local port="$1"
  while lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
    port=$((port + 1))
  done
  printf '%s' "$port"
}

BACKEND_PORT="$(find_free_port "${BACKEND_PORT:-5000}")"
FRONTEND_PORT="$(find_free_port "${FRONTEND_PORT:-5173}")"
if [ "$FRONTEND_PORT" -eq "$BACKEND_PORT" ]; then
  FRONTEND_PORT="$(find_free_port $((FRONTEND_PORT + 1)))"
fi

if [ ! -x "$ROOT/backend/.venv/bin/python" ]; then
  echo "Missing backend/.venv."
  echo "Run: python3.12 -m venv backend/.venv && backend/.venv/bin/pip install -r backend/requirements.txt"
  exit 1
fi
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "Missing frontend/node_modules. Run: cd frontend && npm install"
  exit 1
fi
if [ ! -f "$ROOT/backend/.env" ]; then
  echo "Missing backend/.env. Copy backend/.env.example and edit the values."
  exit 1
fi

echo "Starting backend on http://127.0.0.1:$BACKEND_PORT"
(
  cd "$ROOT/backend"
  BACKEND_PORT="$BACKEND_PORT" \
  FRONTEND_ORIGIN="http://localhost:$FRONTEND_PORT" \
  .venv/bin/python app.py
) > "$ROOT/backend.log" 2>&1 &
BACK_PID=$!

echo "Starting frontend on http://localhost:$FRONTEND_PORT"
(
  cd "$ROOT/frontend"
  VITE_BACKEND_PORT="$BACKEND_PORT" \
  npm run dev -- --port "$FRONTEND_PORT" --strictPort
) > "$ROOT/frontend.log" 2>&1 &
FRONT_PID=$!

cleanup() {
  echo "Stopping servers..."
  kill "$BACK_PID" "$FRONT_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:$BACKEND_PORT/api/health" >/dev/null 2>&1; then
    echo "Backend ready."
    break
  fi
  sleep 1
done

for _ in $(seq 1 30); do
  if curl -fsS "http://localhost:$FRONTEND_PORT" >/dev/null 2>&1; then
    echo "Frontend ready."
    break
  fi
  sleep 1
done

if command -v open >/dev/null 2>&1; then
  open "http://localhost:$FRONTEND_PORT"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:$FRONTEND_PORT"
fi

echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend:  http://127.0.0.1:$BACKEND_PORT"
echo "Logs:     $ROOT/backend.log and $ROOT/frontend.log"
echo "Press Ctrl+C to stop both servers."
wait
