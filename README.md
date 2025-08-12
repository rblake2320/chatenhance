# UltraChat - AI Orchestrator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/ultrachat/ultraChat/workflows/Node.js%20CI/badge.svg)](https://github.com/ultraChat/ultraChat/actions)

UltraChat is a production-grade, multi-agent AI orchestrator that provides advanced conversational AI capabilities with tool calling, RAG (Retrieval-Augmented Generation), secure code execution, and comprehensive system monitoring. Built with OpenAI integration and designed for enterprise deployment.

## 🚀 Key Features

### Core Capabilities
- **Multi-Agent Orchestration**: Intelligent routing between planner, worker, and reviewer agents
- **OpenAI Integration**: Support for GPT-4, GPT-4o, and other OpenAI models with automatic model selection
- **Tool Calling System**: Extensible tools for code execution, web browsing, file operations, and API calls
- **RAG Pipeline**: Document ingestion, chunking, embedding, and intelligent retrieval
- **Secure Code Sandbox**: Safe execution of Python, JavaScript, TypeScript, and Bash code
- **Real-time WebSocket**: Live updates and agent status monitoring

### Advanced Features
- **Slash Commands**: `/help`, `/tools`, `/mode`, `/depth`, `/upload`, `/explain` and more
- **Multiple Interaction Modes**: Auto, Plan, Do, Review modes for different use cases
- **Depth Control**: 5 levels of analysis granularity (1-5)
- **Citation Support**: Automatic source attribution for RAG responses
- **Content Moderation**: Built-in safety filters and guardrails
- **Comprehensive Logging**: Structured logging with audit trails and PII redaction

### Enterprise Ready
- **Docker Support**: Complete containerization with docker-compose
- **Health Monitoring**: System metrics, performance tracking, and alerting
- **Admin Dashboard**: Web-based administration panel
- **Evaluation Harness**: Automated testing and quality assurance
- **Security Compliance**: Input validation, output filtering, and access controls

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Python** 3.8+ (for code sandbox functionality)
- **OpenAI API Key** (required for AI capabilities)
- **Docker** (optional, for containerized deployment)

## 🛠️ Quick Start

### Automated Setup

**Windows (PowerShell):**
```powershell
.\bootstrap.ps1 -OpenAIKey "your-api-key-here"
