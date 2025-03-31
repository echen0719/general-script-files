@echo off
set /p file=Enter file name or location: 
certutil -hashfile "%file%" MD5
pause
