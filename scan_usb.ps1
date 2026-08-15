Write-Host "`n=== USB DEVICES CONNECTED TO THIS PC ===" -ForegroundColor Cyan

# Method 1: PnP Device scan
Write-Host "`n-- PnP Devices (USB / COM Ports / Portable) --" -ForegroundColor Yellow
Get-PnpDevice -PresentOnly | Where-Object {
    $_.InstanceId -like 'USB*' -or
    $_.Class -eq 'USB' -or
    $_.Class -eq 'WPD' -or
    $_.Class -eq 'Ports' -or
    $_.Class -eq 'AndroidUsbDeviceClass' -or
    $_.Class -eq 'USBDevice'
} | Select-Object Status, Class, FriendlyName | Format-Table -AutoSize

# Method 2: WMI USB Hub devices
Write-Host "`n-- USB Hubs (Win32_USBHub) --" -ForegroundColor Yellow
Get-WmiObject Win32_USBHub | Select-Object DeviceID, Description, Manufacturer | Format-Table -AutoSize

# Method 3: USB Controller devices
Write-Host "`n-- USB Controllers --" -ForegroundColor Yellow
Get-WmiObject Win32_USBController | Select-Object Name, Manufacturer, Status | Format-Table -AutoSize

# Method 4: Disk Drives (USB storage)
Write-Host "`n-- USB Storage / Disk Drives --" -ForegroundColor Yellow
Get-WmiObject Win32_DiskDrive | Where-Object { $_.InterfaceType -eq 'USB' } | Select-Object Model, InterfaceType, MediaType, Size | Format-Table -AutoSize

# Method 5: COM / Serial ports (Arduino, ESP32)
Write-Host "`n-- COM / Serial Ports --" -ForegroundColor Yellow
Get-WmiObject Win32_SerialPort | Select-Object Name, Description, DeviceID, Status | Format-Table -AutoSize

# Method 6: Portable devices (phones, cameras, media players)
Write-Host "`n-- Portable Devices (WPD) --" -ForegroundColor Yellow
Get-WmiObject Win32_PnPEntity | Where-Object { $_.PNPClass -eq 'WPD' } | Select-Object Name, Manufacturer, Status | Format-Table -AutoSize

Write-Host "`n=== SCAN COMPLETE ===" -ForegroundColor Green
