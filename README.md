<!--
---
page_type: sample
languages:
- python
- typescript
products:
- azure-openai
- azure
urlFragment: langchain-azure-openai-starter
name: The LangChain Azure OpenAI Starter Kit
description: Deploy Azure OpenAI with GPT-5-mini using one CLI command. Includes LangChain ChatOpenAI examples for Python and TypeScript using the Responses API and Entra ID authentication.
---
-->
# The LangChain Azure OpenAI Starter Kit

**The fastest way to build LangChain apps using Azure OpenAI.**

Rapidly deploy an Azure OpenAI instance with a GPT-5-mini model using a single CLI command, then connect to it from Python or TypeScript using [LangChain's `ChatOpenAI`](https://docs.langchain.com/oss/python/integrations/chat/azure_chat_openai) with the Azure [v1 API](https://learn.microsoft.com/azure/ai-foundry/openai/api-version-lifecycle) and the [Responses API](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/responses).

This starter is a LangChain-flavored port of [`azure-samples/azure-openai-starter`](https://github.com/Azure-Samples/azure-openai-starter). The infrastructure is the same; the client samples use LangChain instead of the raw OpenAI SDK.

## Why LangChain?

LangChain is a popular framework that makes it easy to build applications with LLMs. 
- **One interface, many models.** With the Azure v1 API you can point `ChatOpenAI` at any model deployed in [Microsoft Foundry](https://learn.microsoft.com/azure/ai-foundry/) (OpenAI, Llama, DeepSeek, Mistral, Phi) by changing the deployment name.
- **Drop-in agents and tools.** Add tool calling, structured output, memory, retrieval, and multi-step agents without rewriting auth or client code.
- **First-class Azure auth.** Works out of the box with Entra ID / `DefaultAzureCredential`.

## Prerequisites

✅ [Azure Subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account)
✅ [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)
✅ [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
✅ Python 3.9+ **or** Node.js 20+

## Quick start

```bash
# 1. Login
az login
azd auth login

# 2. Deploy Azure OpenAI + GPT-5-mini
azd up
```

That's it. You now have **Azure OpenAI** with the **GPT-5-mini** deployment provisioned, and the `Cognitive Services User` role assigned to your account for keyless auth.

## Run the LangChain samples

Pick a language and an auth mode. Entra ID is recommended.

### Option A: Entra ID (recommended) 🔐

No API keys to manage. `DefaultAzureCredential` picks up your `az login` session, a managed identity, or any credential in the [default chain](https://aka.ms/azsdk/python/identity/credential-chains).

```bash
# Set the endpoint from your azd environment
export AZURE_OPENAI_ENDPOINT=$(azd env get-value 'AZURE_OPENAI_ENDPOINT')
```

**Python**

```bash
cd src/python
pip install -r requirements.txt
python responses_example_entra.py
```

**TypeScript**

```bash
cd src/typescript
npm install
npm run start:entra
```

### Option B: API key

```bash
export AZURE_OPENAI_ENDPOINT=$(azd env get-value 'AZURE_OPENAI_ENDPOINT')
export AZURE_OPENAI_API_KEY=$(azd env get-value 'AZURE_OPENAI_API_KEY')
```

**Python**

```bash
cd src/python
pip install -r requirements.txt
python responses_example.py
```

**TypeScript**

```bash
cd src/typescript
npm install
npm start
```

## What the samples show

Both samples use `ChatOpenAI` with:

- `base_url` set to your Azure endpoint + `/openai/v1/`
- `use_responses_api=True` (Python) / `useResponsesApi: true` (TypeScript)
- Either an API key or an Entra ID token provider

They run two prompts (a plain string and a system + user conversation) and print the model output plus reasoning / output token counts from LangChain's `usage_metadata`.

See [`CLIENT_README.md`](./CLIENT_README.md) for a deeper walkthrough, switching auth modes, and adding tools or structured output.

## Project structure

```text
langchain-azure-openai-starter/
├─ azure.yaml                        # azd template manifest
├─ infra/                            # Bicep: Azure OpenAI + GPT-5-mini deployment
│  ├─ main.bicep
│  ├─ main.parameters.json
│  └─ resources.bicep
├─ src/
│  ├─ python/                        # LangChain (Python) samples
│  │  ├─ requirements.txt
│  │  ├─ responses_example.py        # API key auth
│  │  └─ responses_example_entra.py  # Entra ID auth
│  └─ typescript/                    # LangChain (TypeScript) samples
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ responses_example.ts        # API key auth
│     └─ responses_example_entra.ts  # Entra ID auth
└─ README.md
```

## Clean up

```bash
azd down --purge
```

## Related docs

- [LangChain: AzureChatOpenAI integration](https://python.langchain.com/docs/integrations/chat/azure_chat_openai/)
- [LangChain: Microsoft provider page](https://python.langchain.com/docs/integrations/providers/microsoft/)
- [Azure OpenAI: Responses API](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/responses)
- [Azure OpenAI: v1 API lifecycle](https://learn.microsoft.com/azure/ai-foundry/openai/api-version-lifecycle)

## License

MIT. See the original [`azure-samples/azure-openai-starter`](https://github.com/Azure-Samples/azure-openai-starter) for the upstream template this project is based on.
