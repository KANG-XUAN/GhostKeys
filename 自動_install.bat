@echo off

start cmd /c "cd /d %~dp0backend && npm install"

cd frontend
npm install
cd ..


