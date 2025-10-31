# Conversational RAG and Document Ingestion System

This repository contains the backend for a comprehensive Conversational RAG (Retrieval-Augmented Generation) and document ingestion system. It is built using FastAPI and provides a robust architecture for processing documents, generating embeddings, and powering a multi-turn conversational AI.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
  - [Document Ingestion Flow](#document-ingestion-flow)
  - [Conversational RAG Flow](#conversational-rag-flow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Document Ingestion](#document-ingestion)
  - [Conversational RAG](#conversational-rag)
  - [Interview Booking](#interview-booking)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)

## Features

- **Dual Document Ingestion**: Upload and process both PDF and TXT files.
- **Flexible Text Chunking**: Choose between "fixed-length" or "semantic" chunking strategies.
- **Vector Embeddings**: Generates vector embeddings for text chunks using state-of-the-art models.
- **Scalable Vector Storage**: Utilizes enterprise-ready vector databases like Pinecone, Qdrant, Weaviate, or Milvus.
- **Metadata Management**: Stores document and chunk metadata in a relational or NoSQL database.
- **Custom RAG Pipeline**: Implements a custom Retrieval-Augmented Generation pipeline for question answering.
- **Multi-Turn Conversations**: Maintains conversation history using Redis for contextual follow-up questions.
- **Interview Booking System**: Allows users to book interviews through the conversational interface.
- **Modular and Clean Code**: Adheres to industry best practices with a well-typed and modular codebase.

## Architecture Overview

The system is designed with a decoupled architecture, separating the concerns of document processing and conversational AI into two main pipelines.

### Document Ingestion Flow

1.  **File Upload**: A user uploads a PDF or TXT file via the `/ingest` endpoint.
2.  **Text Extraction**: The text is extracted from the uploaded file.
3.  **Chunking**: The extracted text is split into smaller chunks using the selected strategy (fixed or semantic).
4.  **Embedding Generation**: Each chunk of text is converted into a numerical vector embedding.
5.  **Data Storage**:
    - The embeddings are stored in a high-performance vector database (e.g., Pinecone, Qdrant).
    - Associated metadata (filename, chunk index, etc.) is saved in a separate SQL or NoSQL database.

### Conversational RAG Flow

1.  **User Query**: A user sends a message to the `/chat` endpoint, including a `conversation_id`.
2.  **Memory Retrieval**: The conversation history is fetched from Redis to provide context.
3.  **Relevant Document Retrieval**: The user's query is converted into an embedding and used to search the vector database for the most relevant text chunks from the ingested documents.
4.  **Prompt Augmentation**: The retrieved text chunks and conversation history are combined with the user's current query to create a rich prompt for the Language Model (LLM).
5.  **LLM Response Generation**: The augmented prompt is sent to a powerful LLM (e.g., GPT-4, Llama) to generate a coherent and contextually aware response.
6.  **Memory Update**: The latest user query and AI response are saved to Redis to maintain the conversation flow.
7.  **Booking Detection**: If the user's intent is to book an interview, the system extracts the necessary information and saves it to the database.

## Technology Stack

- **Backend Framework**: FastAPI
- **Vector Database**: Pinecone, Qdrant, Weaviate, or Milvus
- **Metadata Database**: PostgreSQL (or other SQL/NoSQL databases)
- **Chat Memory**: Redis
- **Embedding Models**: OpenAI, HuggingFace, etc.
- **Language Models**: GPT-4, Llama, etc.
- **(Optional) Background Tasks**: Celery with Redis or RabbitMQ

## Architecture Overview

```bash
Client
  │
  │ POST /ingest (file, strategy)                     POST /chat (conversation_id, message)
  │────────────────────────────────────────────┐      │─────────────────────────────────────┐
  │                                            │      │                                     │
  ▼                                            ▼      ▼                                     ▼
FastAPI(Ingest endpoint)                 FastAPI(Chat endpoint)
  │                                            │
  │ Validate auth, save file meta              │ Validate auth, get/create conversation_id
  │ Save file to S3/MinIO (optional)           │ Append user message to Redis (conversation:{id}:recent)
  │ Extract text (pypdf/tika)                  │ Get conversation summary from Redis
  │ Chunk text (fixed | semantic)              │ Embed user message -> query VectorDB (top-k)
  │ Persist chunk metadata -> Postgres/Mongo   │ VectorDB returns chunk_ids + snippets
  │ Batch embed chunks -> EmbeddingService     │ Build prompt: system + summary + recent + retrieved chunks
  │ Upsert vectors to VectorDB (chunk_id->vec) │ Call LLM -> assistant reply
  │ Update ingestion status                     │ Save assistant reply to Redis conversation
  │ Return ingestion task/file_id               │ If booking intent -> call Booking service -> store booking
  │                                            │ Return reply to client (conversation_id + text)
  ▼                                            ▼
Background worker(s) (Celery/RQ/BackgroundTasks)
  ├─ retry embeddings/upserts
  └─ expensive parsing, email notifications, calendar invites

Storage:
  ├─ VectorDB: Pinecone/Qdrant/Weaviate/Milvus (vectors + light metadata)
  ├─ Metadata DB: Postgres / MongoDB (files, chunks, bookings)
  └─ Redis: conversation memory, transient tokens, rate-limits

External:
  ├─ Embedding API (OpenAI/HF)
  └─ LLM API (OpenAI/GPT/hosted Llama)
```
