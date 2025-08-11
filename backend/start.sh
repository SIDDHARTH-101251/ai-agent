#!/usr/bin/env sh
set -e
# Enable gunicorn-like uvicorn workers for prod
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers ${UVICORN_WORKERS:-2}