# Neravu: AI Assistant for Redmine

An AI-assisted Redmine companion that helps users draft, refine, and publish ticket updates through a conversational interface, improving clarity and reducing the effort required to maintain project communication.

## Overview

Writing clear and complete ticket updates can be time-consuming. Neravu simplifies this process by combining Redmine integration with an AI-powered chat experience. Users can review ticket context, draft comments, improve wording, and publish updates directly to Redmine.

## Features

* Login using Redmine URL and API key
* View recently accessed tickets
* View assigned tickets
* Conversational chat interface for ticket discussions
* AI-assisted comment drafting and refinement
* Edit generated comments before publishing
* Push updates directly to Redmine
* Persistent chat history with timestamps

## Tech Stack

### Backend

* Python
* FastAPI
* Redmine REST API
* Local LLM integration

### Frontend

* React
* TypeScript
* Vite

### Infrastructure

* Docker
* Redmine

## Project Journey

This project began with the goal of making Redmine updates easier to write and maintain.

The initial phase focused on setting up a local Redmine environment using Docker, exploring the Redmine APIs, creating sample tickets, and retrieving ticket comments programmatically. Different approaches for local LLM hosting were evaluated, including vLLM and Ollama, to identify a lightweight and practical development workflow.

The project gradually evolved into a full-stack application featuring user authentication, ticket navigation, conversational drafting, comment refinement, and direct publishing of updates back to Redmine. Throughout development, the focus remained on reducing the effort required to write high-quality ticket updates while keeping the user experience simple and intuitive.

## Running the Application

### Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend endpoint:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend endpoint:

```text
http://localhost:5173
```

## Future Improvements

* Better prompt engineering for ticket summarization
* Support for multiple LLM backends
* Redmine project-level configuration
* Team collaboration features
* Context-aware ticket recommendations
* Containerized deployment

