@echo off
chcp 65001 >nul
title ELITE Atacado Brasil

:: Tenta abrir com Chrome (mais compatível com file://)
set "ARQUIVO=%~dp0plataforma.html"

set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
    start "" "%CHROME%" --allow-file-access-from-files "%ARQUIVO%"
    goto :fim
)

set "CHROME_USER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME_USER%" (
    start "" "%CHROME_USER%" --allow-file-access-from-files "%ARQUIVO%"
    goto :fim
)

:: Tenta Edge
set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
    start "" "%EDGE%" "%ARQUIVO%"
    goto :fim
)

:: Fallback: navegador padrão do sistema
start "" "%ARQUIVO%"

:fim
