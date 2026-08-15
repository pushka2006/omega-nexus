# OMEGA NEXUS AI OS – Startup Script (Windows)

Write-Host "=== OMEGA NEXUS AI OS v2.0 ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example" -ForegroundColor Yellow
}

Write-Host "Starting all services with Docker Compose..." -ForegroundColor Green
docker compose up -d

Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  Dashboard:  http://localhost:3000"
Write-Host "  API:        http://localhost:8000"
Write-Host "  API Docs:   http://localhost:8000/docs"
Write-Host "  MinIO:      http://localhost:9001"
Write-Host "  ChromaDB:   http://localhost:8001"
Write-Host ""
Write-Host "Master AI Brain is initializing..." -ForegroundColor Green
