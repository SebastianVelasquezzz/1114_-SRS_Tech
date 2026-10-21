@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Iniciando SSR TECH...
npm start
echo.
echo Si aparecio un error, toma una captura de esta ventana.
pause
