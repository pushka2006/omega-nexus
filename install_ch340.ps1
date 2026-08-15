$dest = Join-Path $env:TEMP "CH341SER.EXE"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$urls = @(
    "https://www.wch.cn/downloads/file/65.html",
    "https://www.wch-ic.com/downloads/file/65.html",
    "https://files.waveshare.com/upload/5/56/CH341SER.ZIP"
)

$downloaded = $false
foreach ($url in $urls) {
    Write-Host "Trying: $url"
    try {
        $tmpFile = $dest + ".tmp"
        Invoke-WebRequest -Uri $url -OutFile $tmpFile -UseBasicParsing -TimeoutSec 20
        $bytes = (Get-Item $tmpFile).Length
        Write-Host "  Got $bytes bytes"
        if ($bytes -gt 50000) {
            Move-Item $tmpFile $dest -Force
            $downloaded = $true
            Write-Host "  Success!"
            break
        } else {
            Remove-Item $tmpFile -Force
            Write-Host "  Too small, skipping"
        }
    } catch {
        Write-Host "  Failed: $_"
    }
}

if (-not $downloaded) {
    Write-Host ""
    Write-Host "Automatic download failed. Using pnputil to force driver update from Windows Update..."
    
    # Try to force Windows Update to install the driver for the CH340 VID/PID
    Write-Host "Triggering Windows Update driver install for VID_1A86 PID_7523..."
    pnputil /scan-devices
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "Checking if driver auto-installed..."
    Get-WmiObject Win32_SerialPort | Select-Object Name, DeviceID, Status | Format-Table -AutoSize
    
    Write-Host ""
    Write-Host "COM Ports in registry:"
    Get-ItemProperty "HKLM:\HARDWARE\DEVICEMAP\SERIALCOMM" -ErrorAction SilentlyContinue
} else {
    Write-Host "Launching installer - please click YES on UAC..."
    if ($dest.EndsWith(".ZIP")) {
        Expand-Archive -Path $dest -DestinationPath "$env:TEMP\CH341" -Force
        $exe = Get-ChildItem "$env:TEMP\CH341" -Filter "*.EXE" -Recurse | Select-Object -First 1
        Start-Process $exe.FullName -Verb RunAs -Wait
    } else {
        Start-Process $dest -Verb RunAs -Wait
    }
    Write-Host "Done. Checking ports..."
    Get-WmiObject Win32_SerialPort | Select-Object Name, DeviceID, Status | Format-Table -AutoSize
}
