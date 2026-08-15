# Specifically hunt for ESP32, CP210x, CH340, FTDI - common USB-Serial chips used by ESP32 boards
Write-Host "`n=== ESP32 / MICROCONTROLLER USB DEVICE SCAN ===" -ForegroundColor Cyan

Write-Host "`n-- Searching for ESP32 / Silicon Labs CP210x / CH340 / FTDI chips --" -ForegroundColor Yellow
$found = Get-PnpDevice -PresentOnly | Where-Object {
    $_.FriendlyName -match "CP210|CH340|CH341|FTDI|FT232|Silicon Labs|ESP|USB-SERIAL|USB Serial|USB2.0-Serial|USB-Enhanced-SERIAL|CDC"
}

if ($found) {
    $found | Select-Object Status, Class, FriendlyName, InstanceId | Format-Table -AutoSize
} else {
    Write-Host "  [NOT FOUND] No ESP32-related USB-Serial adapter found." -ForegroundColor Red
}

Write-Host "`n-- All USB Composite / Serial Devices (checking VIDs) --" -ForegroundColor Yellow
Get-WmiObject Win32_PnPEntity | Where-Object {
    $_.PNPDeviceID -match "VID_10C4|VID_1A86|VID_0403|VID_303A|VID_239A|VID_2341"
} | Select-Object Name, DeviceID, Status | Format-Table -AutoSize

Write-Host "`n-- All COM Ports currently available --" -ForegroundColor Yellow
Get-WmiObject Win32_SerialPort | Select-Object Name, Description, DeviceID, Status | Format-Table -AutoSize

# Also look via registry
Write-Host "`n-- COM Port Registry Entries --" -ForegroundColor Yellow
Get-ItemProperty "HKLM:\HARDWARE\DEVICEMAP\SERIALCOMM" -ErrorAction SilentlyContinue

Write-Host "`n-- USB Devices (all, looking for new ones) --" -ForegroundColor Yellow
Get-WmiObject Win32_PnPEntity | Where-Object {
    $_.PNPDeviceID -like "USB\*" -and $_.Present -ne $false
} | Select-Object Name, Manufacturer, Status, PNPDeviceID | Format-Table -AutoSize

Write-Host "`n=== SCAN COMPLETE ===" -ForegroundColor Green
