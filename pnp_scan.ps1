Start-Process powershell -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-Command", "pnputil /scan-devices; Start-Sleep 3; Get-WmiObject Win32_SerialPort | Select-Object Name,DeviceID,Status | Format-Table -AutoSize; pause"
) -Verb RunAs -Wait
