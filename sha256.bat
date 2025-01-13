@echo off
set /p filename=Enter file name or location: 
certutil -hashfile "%file%" SHA256
pause
