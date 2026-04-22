#!/usr/bin/env bash
# Lightweight source validation: ensures key files exist and Python files parse.
set -e

cd "$(dirname "$0")"

required=(
    "azure.yaml"
    "infra/main.bicep"
    "infra/resources.bicep"
    "src/python/requirements.txt"
    "src/python/responses_example.py"
    "src/python/responses_example_entra.py"
    "src/typescript/package.json"
    "src/typescript/tsconfig.json"
    "src/typescript/responses_example.ts"
    "src/typescript/responses_example_entra.ts"
)

echo "Checking required files..."
for f in "${required[@]}"; do
    if [[ ! -f "$f" ]]; then
        echo "  MISSING: $f"
        exit 1
    fi
    echo "  OK: $f"
done

if command -v python3 >/dev/null 2>&1; then
    echo "Python syntax check..."
    python3 -m py_compile src/python/responses_example.py src/python/responses_example_entra.py
    echo "  OK"
fi

echo "All checks passed."
