@echo off
set /p file=Enter file name or location: 
certutil -hashfile "%file%" SHA256
pause
