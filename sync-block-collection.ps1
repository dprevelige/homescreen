$ErrorActionPreference = 'Stop'

$sourceRoot = $PSScriptRoot
$sourceUrl = 'https://github.com/adobe/aem-block-collection.git'
$sourceBranch = 'main'
$sourceBlocks = Join-Path $sourceRoot 'blocks'
$checkoutRoot = Join-Path ([System.IO.Path]::GetTempPath()) "aem-block-collection-$([guid]::NewGuid())"

try {
  Write-Host "Cloning $sourceUrl@$sourceBranch"
  & git clone --depth 1 --branch $sourceBranch $sourceUrl $checkoutRoot
  if ($LASTEXITCODE -ne 0) { throw 'Failed to clone the AEM block collection.' }

  $collectionBlocks = Join-Path $checkoutRoot 'blocks'
  if (-not (Test-Path -Path $collectionBlocks -PathType Container)) {
    throw 'The AEM block collection does not contain a blocks directory.'
  }

  if (-not (Test-Path -Path $sourceBlocks -PathType Container)) {
    New-Item -Path $sourceBlocks -ItemType Directory | Out-Null
  }

  Get-ChildItem -Path $collectionBlocks | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $sourceBlocks -Recurse -Force
    Write-Host "Imported $($_.Name)"
  }
} finally {
  if (Test-Path -Path $checkoutRoot) {
    Remove-Item -Path $checkoutRoot -Recurse -Force
  }
}