#!/usr/bin/env python3
import os
from openai import OpenAI

# Initialize client (reads OPENAI_API_KEY from environment)
client = OpenAI()

# Make a streaming API call
print("Response: ", end="", flush=True)
stream = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[
        {"role": "user", "content": "COunt 1 to 100"}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)

print()  # New line at end
