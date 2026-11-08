@echo off
cd /d "%~dp0mobile"
echo Starting Hen Management Mobile App with Cloud Tunnel (Hotspot & 5G compatible)...
npx expo start --tunnel
pause
