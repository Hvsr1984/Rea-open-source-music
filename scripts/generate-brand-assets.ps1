param(
    [string]$SourceImage = 'C:\Users\harsh\.gemini\antigravity-ide\brain\df032b5b-6e8c-4401-ab77-5d42c1d40a0e\.user_uploaded\media_1792946243507.jpg',
    [string]$ProjectRoot = 'C:\Users\harsh\OneDrive\Desktop\rea\rea-music'
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $SourceImage)) {
    Write-Error "Source image does not exist at $SourceImage"
    exit 1
}

Write-Host "[REA Brand Generator] Loading source image: $SourceImage"
$srcImg = [System.Drawing.Image]::FromFile($SourceImage)
Write-Host ("[REA Brand Generator] Source Dimensions: " + $srcImg.Width + " x " + $srcImg.Height)

function New-ResizedBitmap {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height
    )
    $dest = New-Object System.Drawing.Bitmap $Width, $Height
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($Image, 0, 0, $Width, $Height)
    $g.Dispose()
    return $dest
}

function New-MaskableBitmap {
    param(
        [System.Drawing.Image]$Image,
        [int]$Size = 512,
        [int]$SafeSize = 400
    )
    $dest = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    # Brand dark background #0a0a0e
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 10, 10, 14))
    $g.FillRectangle($bgBrush, 0, 0, $Size, $Size)
    $bgBrush.Dispose()
    
    $offset = [int](($Size - $SafeSize) / 2)
    $g.DrawImage($Image, $offset, $offset, $SafeSize, $SafeSize)
    $g.Dispose()
    return $dest
}

function Save-Png {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$Path
    )
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host ("  Saved PNG: " + $Path + " (" + $Bitmap.Width + "x" + $Bitmap.Height + ")")
}

function Save-Jpeg {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$Path,
        [long]$Quality = 95
    )
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
    $Bitmap.Save($Path, $codec, $encoderParams)
    Write-Host ("  Saved JPEG: " + $Path + " (" + $Bitmap.Width + "x" + $Bitmap.Height + " @ quality " + $Quality + ")")
}

function Build-MultiResIco {
    param(
        [System.Drawing.Bitmap[]]$Images,
        [string]$OutFile
    )
    $dir = Split-Path $OutFile -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $pngStreams = @()
    foreach ($img in $Images) {
        $ms = New-Object System.IO.MemoryStream
        $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngStreams += $ms
    }
    
    $fs = [System.IO.File]::Create($OutFile)
    $bw = New-Object System.IO.BinaryWriter($fs)
    
    # 6-byte ICO Header
    $bw.Write([uint16]0) # Reserved
    $bw.Write([uint16]1) # Type 1 = ICO
    $bw.Write([uint16]$Images.Length) # Number of images
    
    $offset = 6 + ($Images.Length * 16)
    
    for ($i = 0; $i -lt $Images.Length; $i++) {
        $img = $Images[$i]
        $pngData = $pngStreams[$i].ToArray()
        
        $w = if ($img.Width -ge 256) { 0 } else { [byte]$img.Width }
        $h = if ($img.Height -ge 256) { 0 } else { [byte]$img.Height }
        
        $bw.Write([byte]$w)
        $bw.Write([byte]$h)
        $bw.Write([byte]0) # Color palette count (0 = >=8bpp)
        $bw.Write([byte]0) # Reserved
        $bw.Write([uint16]1) # Color planes
        $bw.Write([uint16]32) # Bits per pixel
        $bw.Write([uint32]$pngData.Length) # Size of image data
        $bw.Write([uint32]$offset) # Offset
        
        $offset += $pngData.Length
    }
    
    for ($i = 0; $i -lt $Images.Length; $i++) {
        $pngData = $pngStreams[$i].ToArray()
        $bw.Write($pngData)
        $pngStreams[$i].Dispose()
    }
    
    $bw.Close()
    $fs.Close()
    Write-Host ("  Generated valid multi-resolution ICO: " + $OutFile)
}

# 1. Generate full-resolution 1024x1024 master PNG
$master1024 = New-ResizedBitmap -Image $srcImg -Width 1024 -Height 1024

# 2. Generate specific icon resolutions
$bmp512 = New-ResizedBitmap -Image $srcImg -Width 512 -Height 512
$bmp192 = New-ResizedBitmap -Image $srcImg -Width 192 -Height 192
$bmp180 = New-ResizedBitmap -Image $srcImg -Width 180 -Height 180
$bmp48  = New-ResizedBitmap -Image $srcImg -Width 48 -Height 48
$bmp32  = New-ResizedBitmap -Image $srcImg -Width 32 -Height 32
$bmp16  = New-ResizedBitmap -Image $srcImg -Width 16 -Height 16
$maskable512 = New-MaskableBitmap -Image $srcImg -Size 512 -SafeSize 400

Write-Host "Writing assets to public/..."
Save-Png -Bitmap $master1024 -Path "$ProjectRoot\public\branding\rea-music-logo.png"
Save-Png -Bitmap $bmp16 -Path "$ProjectRoot\public\favicon-16x16.png"
Save-Png -Bitmap $bmp32 -Path "$ProjectRoot\public\favicon-32x32.png"
Save-Png -Bitmap $bmp48 -Path "$ProjectRoot\public\favicon-48x48.png"
Save-Png -Bitmap $bmp180 -Path "$ProjectRoot\public\apple-touch-icon.png"
Save-Png -Bitmap $bmp192 -Path "$ProjectRoot\public\icon-192.png"
Save-Png -Bitmap $bmp512 -Path "$ProjectRoot\public\icon-512.png"
Save-Png -Bitmap $maskable512 -Path "$ProjectRoot\public\icon-maskable-512.png"
Build-MultiResIco -Images @($bmp16, $bmp32, $bmp48) -OutFile "$ProjectRoot\public\favicon.ico"

Write-Host "Writing assets to root project..."
Save-Png -Bitmap $master1024 -Path "$ProjectRoot\branding\rea-music-logo.png"
Save-Png -Bitmap $bmp16 -Path "$ProjectRoot\favicon-16x16.png"
Save-Png -Bitmap $bmp32 -Path "$ProjectRoot\favicon-32x32.png"
Save-Png -Bitmap $bmp48 -Path "$ProjectRoot\favicon-48x48.png"
Save-Png -Bitmap $bmp180 -Path "$ProjectRoot\apple-touch-icon.png"
Save-Png -Bitmap $bmp192 -Path "$ProjectRoot\icon-192.png"
Save-Png -Bitmap $bmp512 -Path "$ProjectRoot\icon-512.png"
Save-Png -Bitmap $maskable512 -Path "$ProjectRoot\icon-maskable-512.png"
Build-MultiResIco -Images @($bmp16, $bmp32, $bmp48) -OutFile "$ProjectRoot\favicon.ico"

Write-Host "Writing assets to assets/ directory (updating existing paths)..."
Save-Png -Bitmap $master1024 -Path "$ProjectRoot\assets\branding\rea-music-logo.png"
Save-Jpeg -Bitmap $master1024 -Path "$ProjectRoot\assets\branding\rea-music-app-cover.jpg" -Quality 95
Save-Png -Bitmap $bmp180 -Path "$ProjectRoot\assets\icons\apple-touch-icon.png"
Save-Png -Bitmap $bmp192 -Path "$ProjectRoot\assets\icons\icon-192.png"
Save-Png -Bitmap $bmp512 -Path "$ProjectRoot\assets\icons\icon-512.png"
Save-Png -Bitmap $maskable512 -Path "$ProjectRoot\assets\icons\icon-maskable-512.png"
Save-Png -Bitmap $maskable512 -Path "$ProjectRoot\public\assets\icons\icon-maskable-512.png"
Save-Jpeg -Bitmap $master1024 -Path "$ProjectRoot\assets\icons\logo.jpg" -Quality 95
Save-Jpeg -Bitmap $master1024 -Path "$ProjectRoot\assets\logo.jpg" -Quality 95

# Dispose all bitmaps
$srcImg.Dispose()
$master1024.Dispose()
$bmp512.Dispose()
$maskable512.Dispose()
$bmp192.Dispose()
$bmp180.Dispose()
$bmp48.Dispose()
$bmp32.Dispose()
$bmp16.Dispose()

Write-Host "[REA Brand Generator] All official brand and icon assets generated successfully!"
