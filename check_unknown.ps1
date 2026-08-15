Write-Host "`n=== CHECKING FOR UNKNOWN/ERROR DEVICES (potential ESP32) ===" -ForegroundColor Cyan
Get-PnpDevice | Where-Object { $_.Status -eq 'Unknown' -or $_.Status -eq 'Error' } | Select-Object Status, Class, FriendlyName, InstanceId | Format-Table -AutoSize

Write-Host "`n=== CHECKING DEVICE MANAGER FOR ANY NEW USB (last 5 min) ===" -ForegroundColor Cyan
Get-WmiObject Win32_PnPEntity | Where-Object {
    $_.PNPDeviceID -like "USB\*"
} | Select-Object Name, Manufacturer, Status, PNPDeviceID | Format-Table -AutoSize
