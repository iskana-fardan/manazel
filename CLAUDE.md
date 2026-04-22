# CLAUDE.md

## 🧠 Project Overview

This is a fullstack web application for managing and exploring Islamic knowledge roadmaps.

### Tech Stack

- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React + TypeScript + Material UI
- Architecture: Feature-based (frontend), MVC-like (backend)

---

## 📁 Project Structure

### Backend (`/backend`)

- `models/` → Mongoose schemas
- `controllers/` → business logic
- `routes/` → API endpoints
- `middleware/` → auth, error handling, roles
- `startup/` → DB connection, logging
- `tests/` → unit tests

### Frontend (`/frontend`)

- `src/admin/features/` → feature-based modules (books, fields, contributors, roadmaps)
- `src/services/` → API layer
- `src/hooks/` → React Query hooks
- `src/components/` → reusable UI
- `src/pages/` → public pages
- `src/data/` → static/dummy data

---

## ⚙️ Coding Guidelines

### General

- Keep code simple and readable
- Prefer small, focused functions
- Avoid unnecessary abstractions
- Follow existing patterns in the codebase

---

### Backend Rules

- Use async/await (no `.then`)
- Keep controllers thin, move logic if needed
- Always handle errors properly
- Validate input (Joi or similar if present)
- Follow existing structure when adding new features

---

### Frontend Rules

- Use functional components
- Use hooks (React Query, custom hooks)
- Keep components small and reusable
- Separate UI and logic when possible
- Follow existing feature structure

---

## 🔗 API Integration Rules

- Always use existing API service files (`services/*.api.ts`)
- Do NOT call fetch/axios directly inside components
- Use React Query for data fetching and mutations

---

## 🧩 When Adding New Features

### Backend

1. Create model (if needed)
2. Create controller
3. Create routes
4. Register route in app

### Frontend

1. Add API function in `services/`
2. Add hook in `hooks/`
3. Build UI in feature folder
4. Connect UI with hook

---

## 🧪 Testing & Safety

- Do not break existing API contracts
- Reuse existing patterns before creating new ones
- Ask before making large structural changes

---

## 🚫 Things to Avoid

- Do not refactor entire project unless asked
- Do not rename files or folders unnecessarily
- Do not introduce new libraries without clear reason
- Do not modify unrelated files

---

## 🎯 How to Help

When given a task:

1. Understand the relevant files first
2. Focus only on necessary parts
3. Provide minimal but complete solution
4. Avoid over-engineering

---

## 💡 Context Optimization

- Prefer working on specific files instead of entire project
- Ask for clarification if scope is unclear
- Keep responses concise and actionable

---

## 📌 Notes

- This project uses both static data (`frontend/src/data`) and API
- Some features may still be in development
- Follow current patterns instead of reinventing structure
