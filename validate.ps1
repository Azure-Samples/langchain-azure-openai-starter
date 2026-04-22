# Lightweight source validation: ensures key files exist and Python files parse.
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$required = @(
    "azure.yaml",
    "infra/main.bicep",
    "infra/resources.bicep",
    "src/python/requirements.txt",
    "src/python/responses_example.py",
    "src/python/responses_example_entra.py",
    "src/typescript/package.json",
    "src/typescript/tsconfig.json",
    "src/typescript/responses_example.ts",
    "src/typescript/responses_example_entra.ts"
)

Write-Host "Checking required files..."
foreach ($f in $required) {
    if (-not (Test-Path $f)) {
        Write-Host "  MISSING: $f"
        exit 1
    }
    Write-Host "  OK: $f"
}

if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Python syntax check..."
    python -m py_compile src/python/responses_example.py src/python/responses_example_entra.py
    Write-Host "  OK"
}

Write-Host "All checks passed."
