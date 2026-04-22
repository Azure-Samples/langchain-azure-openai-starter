# LangChain Azure OpenAI Starter - azd Template

Minimal Azure Developer CLI (azd) template for deploying GPT-5-mini on Azure OpenAI, with LangChain samples in Python and TypeScript.

## Template features

- **One-command deployment** (`azd up`) of GPT-5-mini in your chosen region
- **GPT-5-mini (2025-08-07)** — latest reasoning model
- **Azure OpenAI v1 API** — no `api-version` pinning
- **Responses API samples** — Python and TypeScript
- **Entra ID + API key auth** examples for each language
- **LangChain `ChatOpenAI`** as the client

## Template structure

```
├── azure.yaml                        # azd configuration
├── infra/
│   ├── main.bicep                    # Subscription-scope deployment
│   ├── main.parameters.json
│   └── resources.bicep               # Azure OpenAI + GPT-5-mini deployment
├── src/
│   ├── python/
│   │   ├── requirements.txt
│   │   ├── responses_example.py          # API key auth
│   │   └── responses_example_entra.py    # Entra ID auth
│   └── typescript/
│       ├── package.json
│       ├── tsconfig.json
│       ├── responses_example.ts          # API key auth
│       └── responses_example_entra.ts    # Entra ID auth
├── README.md
├── CLIENT_README.md
├── validate.sh
└── validate.ps1
```

## Conventions for contributors

- Client samples use **LangChain `ChatOpenAI`** (not the raw `openai` SDK).
- Use the Azure v1 API: `base_url = "{endpoint}/openai/v1/"`.
- Opt into the Responses API with `use_responses_api=True` (Python) / `useResponsesApi: true` (TypeScript).
- Prefer Entra ID (`DefaultAzureCredential` + `get_bearer_token_provider`) over API keys in examples.
- When adding a sample, add a matching API key version and an Entra ID version.
