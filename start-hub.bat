@echo off
echo Starting Student Hub Capstone...
set SUPABASE_URL=https://gblbesemxedmvdlkrjrh.supabase.co
set SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGJlc2VteGVkbXZkbGtyanJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNjcwNTEsImV4cCI6MjEwNTY0MzA1MX0.6eRUo27mnihMEWLfM0YpZH6Go_NNCq5VWEToAbitZP0

cd /d "%~dp0Smart-AI-Resume-Analyzer"
start "Student Hub API (Port 8000)" cmd /k ".venv\Scripts\python.exe -m uvicorn api.server:app --reload --port 8000"

cd /d "%~dp0web"
start "Student Hub Web (Port 5173)" cmd /k "npm run dev"

echo Done! Web is running at http://localhost:5173/ and API at http://localhost:8000/
