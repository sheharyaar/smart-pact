# backend/Dockerfile
FROM python:3.11.6-slim

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir uvicorn fastapi docker dropbox_sign supabase openai boto3 python-multipart


CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
