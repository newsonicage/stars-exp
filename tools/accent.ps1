Add-Type -AssemblyName System.Drawing

# Pull the two colours a cover actually leads with: downsample hard, throw away
# anything too dark, too pale or too grey to read as an accent, then bucket what
# is left by hue and weight each bucket by how saturated its pixels are. The
# loudest bucket is the accent; the loudest bucket far enough away in hue is the
# counterweight.
function Get-Accents([string]$path) {
  $img = [System.Drawing.Image]::FromFile($path)
  $n = 96
  $bmp = New-Object System.Drawing.Bitmap($n, $n)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $n, $n)
  $g.Dispose(); $img.Dispose()

  $buckets = @{}
  for ($y = 0; $y -lt $n; $y++) {
    for ($x = 0; $x -lt $n; $x++) {
      $c = $bmp.GetPixel($x, $y)
      $h = $c.GetHue(); $s = $c.GetSaturation(); $l = $c.GetBrightness()
      if ($s -lt 0.22) { continue }          # too grey to be an accent
      if ($l -lt 0.12 -or $l -gt 0.82) { continue }  # crushed or blown out
      $b = [int][Math]::Floor($h / 15.0)     # 24 buckets of 15 degrees
      $w = $s * $s                            # favour the vivid pixels
      if (-not $buckets.ContainsKey($b)) { $buckets[$b] = @{ w = 0.0; h = 0.0; s = 0.0; l = 0.0; n = 0 } }
      $buckets[$b].w += $w
      $buckets[$b].h += $h * $w
      $buckets[$b].s += $s * $w
      $buckets[$b].l += $l * $w
      $buckets[$b].n++
    }
  }
  $bmp.Dispose()

  $ranked = $buckets.GetEnumerator() | Sort-Object { -$_.Value.w }
  $out = @()
  foreach ($e in $ranked) {
    $v = $e.Value
    $hue = $v.h / $v.w; $sat = $v.s / $v.w; $lum = $v.l / $v.w
    # keep them at least 45 degrees apart so we get two real colours, not two reds
    $clash = $false
    foreach ($p in $out) {
      $d = [Math]::Abs($p.H - $hue); if ($d -gt 180) { $d = 360 - $d }
      if ($d -lt 45) { $clash = $true }
    }
    if ($clash) { continue }
    $out += [pscustomobject]@{ H = $hue; S = $sat; L = $lum; Weight = $v.w; Pixels = $v.n }
    if ($out.Count -ge 3) { break }
  }
  return $out
}

function HslToHex($h, $s, $l) {
  $c = (1 - [Math]::Abs(2 * $l - 1)) * $s
  $hp = $h / 60.0
  $x = $c * (1 - [Math]::Abs(($hp % 2) - 1))
  $r = 0.0; $g = 0.0; $b = 0.0
  switch ([int][Math]::Floor($hp)) {
    0 { $r = $c; $g = $x }
    1 { $r = $x; $g = $c }
    2 { $g = $c; $b = $x }
    3 { $g = $x; $b = $c }
    4 { $r = $x; $b = $c }
    default { $r = $c; $b = $x }
  }
  $m = $l - $c / 2
  return ('#{0:x2}{1:x2}{2:x2}' -f `
    [int][Math]::Round(($r + $m) * 255), `
    [int][Math]::Round(($g + $m) * 255), `
    [int][Math]::Round(($b + $m) * 255))
}

$cover = $args[0]
$name = [System.IO.Path]::GetFileName($cover)
$acc = @(Get-Accents $cover)

# A cover can be too dark or too grey to yield anything - Heart of the
# Underworld is exactly that. Rather than emit nothing, fall back to the
# house white so the page still has a defined accent to sit on.
if ($acc.Count -eq 0) {
  "{0,-22} FALLBACK  #8a8f9c  #5a6070   (no pixel survived the filter)" -f $name
  return
}

$hexes = @()
foreach ($a in $acc) {
  # a screen accent has to survive a black background - floor the punch
  $pS = [Math]::Max($a.S, 0.82)
  $pL = [Math]::Min([Math]::Max($a.L, 0.55), 0.64)
  $hexes += (HslToHex $a.H $pS $pL)
}
while ($hexes.Count -lt 2) { $hexes += '#5a6070' }
"{0,-22} {1}  {2}   (hues {3:N0} / {4:N0})" -f `
  $name, $hexes[0], $hexes[1], $acc[0].H, $(if ($acc.Count -gt 1) { $acc[1].H } else { 0 })
