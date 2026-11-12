@echo off
cd /d "%~dp0"
 powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:8787/api/status' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
 if %errorlevel%==1 start "TYMIO server" /b "C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1030-493-0_26.1030.493.0_x64__3k8sg7r9htsxt\dependencies\node\bin\node.exe" "%~dp0server.cjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8787/"
echo TYMIO server is running at http://127.0.0.1:8787/
pause

