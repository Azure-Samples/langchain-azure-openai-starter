/**
 * Azure OpenAI GPT-5-mini Responses API example with LangChain ChatOpenAI.
 *
 * Uses the Azure OpenAI v1 API through LangChain's ChatOpenAI with
 * `useResponsesApi: true` and API key authentication.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import type { AIMessage } from "@langchain/core/messages";

function checkEnvironment(): void {
    const missing: string[] = [];
    if (!process.env.AZURE_OPENAI_ENDPOINT) missing.push("AZURE_OPENAI_ENDPOINT");
    if (!process.env.AZURE_OPENAI_API_KEY) missing.push("AZURE_OPENAI_API_KEY");

    if (missing.length > 0) {
        console.error(`Missing environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
}

function buildLlm(): ChatOpenAI {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/+$/, "");
    const apiKey = process.env.AZURE_OPENAI_API_KEY!;

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
    console.log("Azure OpenAI GPT-5-mini - Responses API (LangChain)\n");

    checkEnvironment();
    const llm = buildLlm();

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
