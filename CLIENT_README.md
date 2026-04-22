# LangChain Azure OpenAI Starter - Client Examples

Guide to using your deployed Azure OpenAI **GPT-5-mini** model through **LangChain's `ChatOpenAI`** with the **Responses API** from **Python** and **TypeScript**.

## About the v1 API + Responses API in LangChain

The Azure OpenAI [v1 API](https://learn.microsoft.com/azure/ai-foundry/openai/api-version-lifecycle) lets you use LangChain's `ChatOpenAI` directly against Azure endpoints with native Entra ID support and no `api-version` pinning. The [Responses API](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/responses) adds stateful conversations, built-in server-side tools (code interpreter, image generation, file search, remote MCP), and structured reasoning summaries for reasoning models like GPT-5-mini.

In LangChain:

- Set `base_url` / `configuration.baseURL` to `https://<your-resource>.openai.azure.com/openai/v1/`.
- Pass `use_responses_api=True` (Python) or `useResponsesApi: true` (TypeScript) to opt in to the Responses API.
- Pass an API key **or** a token provider callable as `api_key` / `apiKey`.
- Read token counts from `response.usage_metadata` (including `output_token_details.reasoning` for reasoning models).

## Prerequisites

✅ Azure OpenAI GPT-5-mini deployed (run `azd up` first)
✅ Python 3.9+ **or** Node.js 20+
✅ Azure CLI installed and logged in (`az login`)

## Option A: Entra ID (recommended) 🔐

`DefaultAzureCredential` picks up your Azure CLI login, a managed identity, or any credential in the [default chain](https://aka.ms/azsdk/python/identity/credential-chains). The `Cognitive Services User` role is assigned to your account automatically by `azd up`, so no manual role setup is needed.

```bash
export AZURE_OPENAI_ENDPOINT=$(azd env get-value 'AZURE_OPENAI_ENDPOINT')
```

### Python

```bash
cd src/python
pip install -r requirements.txt
python responses_example_entra.py
```

The key bits of [`responses_example_entra.py`](./src/python/responses_example_entra.py):

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from langchain_openai import ChatOpenAI

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default",
)

llm = ChatOpenAI(
    model="gpt-5-mini",
    base_url=f"{endpoint.rstrip('/')}/openai/v1/",
    api_key=token_provider,   # callable handles token refresh
    use_responses_api=True,
)

response = llm.invoke("Explain quantum computing in simple terms")
print(response.text)
print(response.usage_metadata)
```

### TypeScript

```bash
cd src/typescript
npm install
npm run start:entra
```

The key bits of [`responses_example_entra.ts`](./src/typescript/responses_example_entra.ts):

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
    credential,
    "https://cognitiveservices.azure.com/.default",
);
const apiKey = await tokenProvider();

const llm = new ChatOpenAI({
    model: "gpt-5-mini",
    apiKey,
    configuration: { baseURL: `${endpoint}/openai/v1/` },
    useResponsesApi: true,
});

const response = await llm.invoke("Explain quantum computing in simple terms");
console.log(response.content);
console.log(response.usage_metadata);
```

## Option B: API key

```bash
export AZURE_OPENAI_ENDPOINT=$(azd env get-value 'AZURE_OPENAI_ENDPOINT')
export AZURE_OPENAI_API_KEY=$(azd env get-value 'AZURE_OPENAI_API_KEY')
```

### Python

```bash
cd src/python
pip install -r requirements.txt
python responses_example.py
```

### TypeScript

```bash
cd src/typescript
npm install
npm start
```

## Accessing non-OpenAI models

Because the v1 API routes by deployment name, you can point `ChatOpenAI` at any model deployed in [Microsoft Foundry](https://learn.microsoft.com/azure/ai-foundry/) (Llama, DeepSeek, Mistral, Phi, and others) by changing `model` to that deployment's name. Auth, endpoint, and tool-calling code stay the same.

## Adding tools

The Responses API supports built-in server-side tools. Bind them to the model with `bind_tools`:

```python
llm_with_tools = llm.bind_tools(
    [{"type": "code_interpreter", "container": {"type": "auto"}}]
)
response = llm_with_tools.invoke(
    "Use the code interpreter to compute the 25th Fibonacci number."
)
```

You can also bind Python / TypeScript functions and Pydantic / Zod schemas as regular function-calling tools - see the [LangChain tool calling docs](https://python.langchain.com/docs/concepts/tool_calling/).

## Troubleshooting

- **`401 Unauthorized` with Entra ID** - run `az login` again, and confirm the `Cognitive Services User` role is assigned on your Azure OpenAI resource (`azd up` does this automatically).
- **`404 DeploymentNotFound`** - the `model` argument must match the **deployment name** in your Azure OpenAI resource, not the underlying model name.
- **Reasoning tokens missing from usage** - reasoning token counts only appear for reasoning-capable models (e.g. `gpt-5-mini`, `o4-mini`).

## Related docs

- [LangChain: AzureChatOpenAI integration](https://python.langchain.com/docs/integrations/chat/azure_chat_openai/)
- [LangChain: Microsoft provider page](https://python.langchain.com/docs/integrations/providers/microsoft/)
- [Azure OpenAI: Responses API](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/responses)
- [Azure OpenAI: v1 API lifecycle](https://learn.microsoft.com/azure/ai-foundry/openai/api-version-lifecycle)
