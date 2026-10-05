param()

# Paths
$htmlFile = "d:/PROJECTS/Threat-Zone/brag-output-2026-10-05-095600/composition/index.html"
$mp4Out   = "d:\PROJECTS\Threat-Zone\brag-output-2026-10-05-095600\brag.mp4"
$chrome   = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$fileUrl  = "file:///$htmlFile"

Write-Host "Threat Zone - Screen Capture Renderer" -ForegroundColor Cyan
Write-Host "Output: $mp4Out" -ForegroundColor Gray

# -------------------------------------------------------------------------
# Launch Chrome in app mode
# -------------------------------------------------------------------------
$IsAdmin = ([Security.Principal.WindowsPrincipal] `
            [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
            [Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $IsAdmin) {
    Write-Host "⚠️  Script not running as Administrator – screen capture may fail." `
               -ForegroundColor Yellow
}

$argList = "--app=$fileUrl --window-size=1920,1080 --window-position=0,0 " +
           "--disable-infobars --autoplay-policy=no-user-gesture-required " +
           "--disable-web-security --allow-file-access-from-files"
$chromeProc = Start-Process -FilePath $chrome -ArgumentList $argList -PassThru

Write-Host "Chrome launched (PID $($chromeProc.Id)). Waiting 5s for load…" `
           -ForegroundColor Gray
Start-Sleep -Seconds 5   # give Chrome time to set its window title

# -------------------------------------------------------------------------
# Capture with ffmpeg (gdigrab → fallback to dshow)
# -------------------------------------------------------------------------
Write-Host "Recording 22 seconds with ffmpeg…" -ForegroundColor Yellow

# Grab the Chrome window title (it changes after the 5‑s wait)
$windowTitle = (Get-Process -Id $chromeProc.Id).MainWindowTitle

# Build ffmpeg args – capture the Chrome window by title
$ffArgs = "-y -f gdigrab -framerate 30 -offset_x 0 -offset_y 0 " +
          "-video_size 1920x1080 -i title=`"$windowTitle`" -t 22 " +
          "-c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p " +
          "-movflags +faststart `"$mp4Out`""
$ffProc = Start-Process -FilePath "ffmpeg" -ArgumentList $ffArgs `
                        -NoNewWindow -PassThru -Wait -ErrorAction SilentlyContinue

# If gdigrab failed, try dshow (requires screen‑capture‑recorder driver)
if ($ffProc.ExitCode -ne 0 -or -not (Test-Path $mp4Out)) {
    Write-Host "gdigrab failed (exit $($ffProc.ExitCode)). Trying dshow capture…" `
               -ForegroundColor Yellow
    $dshowArgs = "-y -f dshow -i video=screen-capture-recorder -t 22 " +
                 "-c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p " +
                 "-movflags +faststart `"$mp4Out`""
    $ffProc = Start-Process -FilePath "ffmpeg" -ArgumentList $dshowArgs `
                            -NoNewWindow -PassThru -Wait -ErrorAction SilentlyContinue
}

# -------------------------------------------------------------------------
# Result reporting
# -------------------------------------------------------------------------
if ((Test-Path $mp4Out) -and (Get-Item $mp4Out).Length -gt 0) {
    $size = [math]::Round((Get-Item $mp4Out).Length / 1MB, 1)
    Write-Host "✅ Done! MP4: $mp4Out ($size MB)" -ForegroundColor Green
} else {
    Write-Host "❌ ffmpeg failed. Exit: $($ffProc.ExitCode)" -ForegroundColor Red
}

# Clean up Chrome
Stop-Process -Id $chromeProc.Id -ErrorAction SilentlyContinue
Write-Host "Chrome closed." -ForegroundColor Gray
