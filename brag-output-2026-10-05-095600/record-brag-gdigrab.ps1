param()

$htmlFile = "d:/PROJECTS/Threat-Zone/brag-output-2026-10-05-095600/composition/index.html"
$mp4Out   = "d:\PROJECTS\Threat-Zone\brag-output-2026-10-05-095600\brag.mp4"
$chrome   = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$fileUrl  = "file:///$htmlFile"

Write-Host "Threat Zone - Screen Capture Renderer" -ForegroundColor Cyan
Write-Host "Output: $mp4Out" -ForegroundColor Gray

# Launch Chrome in app mode
$argList = "--app=$fileUrl --window-size=1920,1080 --window-position=0,0 --disable-infobars --autoplay-policy=no-user-gesture-required --disable-web-security --allow-file-access-from-files"
$chromeProc = Start-Process -FilePath $chrome -ArgumentList $argList -PassThru

Write-Host "Chrome launched (PID $($chromeProc.Id)). Waiting 3s for load..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "Recording 22 seconds with ffmpeg gdigrab..." -ForegroundColor Yellow

# Build ffmpeg command as a single string to avoid quoting issues
$ffArgs = "-y -f gdigrab -framerate 30 -offset_x 0 -offset_y 0 -video_size 1920x1080 -i desktop -t 22 -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -movflags +faststart `"$mp4Out`""
$ffProc = Start-Process -FilePath "ffmpeg" -ArgumentList $ffArgs -NoNewWindow -Wait -PassThru

if ($ffProc.ExitCode -eq 0 -and (Test-Path $mp4Out)) {
    $size = [math]::Round((Get-Item $mp4Out).Length / 1MB, 1)
    Write-Host "Done! MP4: $mp4Out ($size MB)" -ForegroundColor Green
} else {
    Write-Host "ffmpeg failed. Exit: $($ffProc.ExitCode)" -ForegroundColor Red
}

Stop-Process -Id $chromeProc.Id -ErrorAction SilentlyContinue
Write-Host "Chrome closed."
