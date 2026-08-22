# tools

## accent.ps1

Samples the two colours a cover actually leads with, so a release page and its
rack in the record store wear the record's own palette instead of a guess.

```powershell
powershell -ExecutionPolicy Bypass -File tools\accent.ps1 assets\your-cover.jpg
```

Prints a `primary secondary` hex pair. Paste it into that release's `accent`
field in `music-data.js`, and into `--warm` / `--cool` at the top of the
release's own page.

How it picks: downsamples to 96x96, discards anything too grey (saturation
< 0.22) or crushed/blown (lightness outside 0.12–0.82), buckets what survives
by hue in 15-degree steps weighted by saturation squared, and takes the two
loudest buckets at least 45 degrees apart. Each is then floored to
saturation 0.82 and lightness 0.55–0.64 so it still reads against black.

A cover with nothing vivid in it — Heart of the Underworld is one — returns
a neutral fallback rather than nothing.

Requires no install: uses System.Drawing via PowerShell.
