@echo off
echo Starting Frontend Server on Port 3000...
echo.
echo Open browser and go to: http://localhost:3000
echo.
cd /d "%~dp0"
python -m http.server 3000
pause
