/**
 * Azure OpenAI GPT-5-mini Responses API example with Entra ID authentication.
 *
 * Uses the Azure OpenAI v1 API through LangChain's ChatOpenAI with
 * `useResponsesApi: true` and a keyless Entra ID token provider
 * (`DefaultAzureCredential`).
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import type { AIMessage } from "@langchain/core/messages";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

function checkEnvironment(): void {
    if (!process.env.AZURE_OPENAI_ENDPOINT) {
        console.error("Missing AZURE_OPENAI_ENDPOINT environment variable");
        process.exit(1);
    }
}

async function buildLlm(): Promise<ChatOpenAI> {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/+$/, "");

    // DefaultAzureCredential picks up your Azure CLI login, a managed identity,
    // or any other credential in the default chain. For production, prefer a
    // specific credential such as ManagedIdentityCredential, or set
    // AZURE_TOKEN_CREDENTIALS to control the chain. See:
    // https://aka.ms/azsdk/js/identity/credential-chains#defaultazurecredential-overview
    const credential = new DefaultAzureCredential();
    const scope = "https://cognitiveservices.azure.com/.default";
    const tokenProvider = getBearerTokenProvider(credential, scope);

    // Resolve the token once at startup. For long-running processes, wrap this
    // in logic that refreshes the token periodically.
    const apiKey = await tokenProvider();

    return new ChatOpenAI({
        model: "gpt-5-mini",
        apiKey,
        configuration: {
            baseURL: `${endpoint}/openai/v1/`,
        },
        useResponsesApi: true,
        maxTokens: 1000,
    });
}

function printResponse(response: AIMessage): void {
    const usage = response.usage_metadata;
    const reasoningTokens = usage?.output_token_details?.reasoning;

    const text =
        typeof response.content === "string"
            ? response.content
            : response.content
                  .map((block) => ("text" in block ? block.text : ""))
                  .join("");

    console.log(`Response: ${text}`);
    if (reasoningTokens !== undefined) {
        console.log(`Reasoning tokens: ${reasoningTokens}`);
    }
    console.log(`Output tokens: ${usage?.output_tokens}`);
}

async function main(): Promise<void> {
    console.log("Azure OpenAI GPT-5-mini - Entra ID Authentication (LangChain)\n");

    checkEnvironment();
    const llm = await buildLlm();

    // Example 1: Simple text input
    console.log("Example 1: Simple text input\n");
    const response1 = await llm.invoke("Explain quantum computing in simple terms");
    printResponse(response1);
    console.log();

    // Example 2: Conversation format
    console.log("Example 2: Conversation format\n");
    const response2 = await llm.invoke([
        ["system", "You are an Azure cloud architect."],
        ["user", "Design a scalable web application architecture."],
    ]);
    printResponse(response2);
}

main().catch((error) => {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
});
