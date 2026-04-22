#!/usr/bin/env python3
"""Azure OpenAI GPT-5-mini Responses API example with Entra ID authentication.

Uses the Azure OpenAI v1 API through LangChain's ChatOpenAI with
``use_responses_api=True`` and a keyless Entra ID token provider
(``DefaultAzureCredential``).
"""

import os

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv(override=True)


def build_llm() -> ChatOpenAI:
    """Create a ChatOpenAI client authenticated with Entra ID."""
    endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]

    # DefaultAzureCredential picks up your Azure CLI login, a managed identity,
    # or any other credential in the default chain. For production, prefer a
    # specific credential such as ManagedIdentityCredential, or set
    # AZURE_TOKEN_CREDENTIALS to control the chain. See:
    # https://aka.ms/azsdk/python/identity/credential-chains#defaultazurecredential-overview
    token_provider = get_bearer_token_provider(
        DefaultAzureCredential(),
        "https://cognitiveservices.azure.com/.default",
    )

    return ChatOpenAI(
        model="gpt-5-mini",
        base_url=f"{endpoint.rstrip('/')}/openai/v1/",
        api_key=token_provider,  # callable handles token refresh
        use_responses_api=True,
        max_tokens=1000,
    )


def print_response(response) -> None:
    """Print the response text and token usage."""
    usage = response.usage_metadata or {}
    output_details = usage.get("output_token_details", {}) or {}
    reasoning_tokens = output_details.get("reasoning")

    print(f"Response: {response.text}")
    if reasoning_tokens is not None:
        print(f"Reasoning tokens: {reasoning_tokens}")
    print(f"Output tokens: {usage.get('output_tokens')}")


def main() -> None:
    """Run Responses API examples with Entra ID authentication."""
    print("Azure OpenAI GPT-5-mini - Entra ID Authentication (LangChain)\n")

    llm = build_llm()

    # Example 1: Simple text input
    print("Example 1: Simple text input\n")
    response = llm.invoke("Explain quantum computing in simple terms")
    print_response(response)
    print()

    # Example 2: Conversation format
    print("Example 2: Conversation format\n")
    response = llm.invoke(
        [
            ("system", "You are an Azure cloud architect."),
            ("user", "Design a scalable web application architecture."),
        ]
    )
    print_response(response)


if __name__ == "__main__":
    main()
