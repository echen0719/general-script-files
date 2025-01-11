@echo off
set /p filename=Enter file name: 
certutil -hashfile "%filename%" SHA256
pause