## High-level steps (what you will implement)

- 1. Receive user query (and user id/session id).

- 2. Compute query embedding with the same embedding model you used for documents.

- 3. Search the vector DB (Pinecone / Qdrant / Weaviate / Milvus) for top-k similar chunks.

- 4. Optionally rerank the top candidates (e.g., using a cross-encoder or simple lexical scoring).

- 5. Assemble context: pick N chunks, order them (most relevant first), and stitch them into a context block while respecting the LLM token limit.

- 6. Add conversation history (from Redis memory) if multi-turn behavior is required.

- 7. Build the prompt (system + context + conversation history + user query + explicit instructions).

- 8. Call the LLM (OpenAI or another provider) with the prompt and get completion.

- 9. Post-process the LLM output (source attribution, trimming, format).

- 10. Save chat state to Redis (for next turns). Store logs/metrics for debugging.

- 11. Return response to the client.
