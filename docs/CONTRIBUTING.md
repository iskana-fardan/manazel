# Contributing — Peta Ilmu Islam

Thank you for contributing. This document covers branching, commits, the PR checklist, code style, and step-by-step guides for adding a new feature module on both the backend and frontend.

---

## Table of Contents

- [Branching Strategy](#branching-strategy)
- [Commit Conventions](#commit-conventions)
- [Pull Request Checklist](#pull-request-checklist)
- [Code Style](#code-style)
- [Adding a New Backend Feature Module](#adding-a-new-backend-feature-module)
- [Adding a New Frontend Admin Feature Module](#adding-a-new-frontend-admin-feature-module)

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Direct pushes are prohibited. |
| `feat/<name>` | New feature work |
| `fix/<name>` | Bug fix |
| `refactor/<name>` | Refactoring with no behavior change |
| `docs/<name>` | Documentation-only changes |
| `chore/<name>` | Build scripts, dependency updates, tooling |

**Rules:**
- Branch from `main`.
- Keep branches short-lived — one PR per concern.
- Delete branches after merging.

---

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature visible to end-users |
| `fix` | Bug fix |
| `refactor` | Code change without behavior change |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Build, deps, config |
| `perf` | Performance improvement |

**Examples:**

```
feat(roadmap): add book-to-section assignment endpoint
fix(auth): clear cookie on logout with correct sameSite attribute
refactor(book): extract resource subdocument into separate schema file
test(integration): add roadmap route integration tests
docs(backend): add full REST API reference to README
```

**Rules:**
- Summary: imperative mood, lowercase, no trailing period, ≤ 72 characters.
- Body: wrap at 72 chars. Explain *why*, not *what*.
- Reference issues in the footer: `Closes #42`.

---

## Pull Request Checklist

Before requesting review, verify:

### Backend changes
- [ ] All affected routes have corresponding unit **and** integration tests.
- [ ] New endpoints follow the `asyncMiddleware(controller)` pattern.
- [ ] New models export both a Mongoose model and a `validate()` function.
- [ ] Input validated with Joi before any database access.
- [ ] Auth requirement is correct (middleware applied where needed).
- [ ] `npm run test:all` passes.

### Frontend changes
- [ ] New API calls go through a service function in `src/services/`, not directly from a component.
- [ ] New hooks live in `src/hooks/` and use the established query key convention.
- [ ] Admin feature modules follow the `<Feature>Page / Table / Dialog / schema / types` structure.
- [ ] `npm run lint` and `npm run build` both pass.
- [ ] Manual smoke test in the browser confirms the feature works end-to-end.

### General
- [ ] No hardcoded secrets, tokens, or credentials.
- [ ] No `console.log` or debug artifacts left in.
- [ ] No unnecessary dependencies added.
- [ ] `CLAUDE.md` updated if the architecture or commands changed.

---

## Code Style

### Backend (JavaScript / CommonJS)

- **Module system:** `require` / `module.exports`. No ESM.
- **Error handling:** Throw errors or return early — never swallow them silently. Use `asyncMiddleware` so every thrown error reaches the global handler.
- **Validation:** Always validate user input with Joi before touching the database. Validation schemas belong in the model file.
- **Responses:** Return appropriate HTTP status codes. Use `res.status(N).json({message})` for errors; return the resource document on success.
- **No comments** on obvious code. Comment only non-obvious constraints or workarounds.

### Frontend (TypeScript / ESM)

- **Data fetching:** Hook → service → apiClient. No direct axios/fetch calls from components.
- **Forms:** React Hook Form + Zod for all admin forms. The dialog component detects create vs. edit mode from `initialData` and calls `reset()` in `useEffect`.
- **State:** React Query for all server state. Local `useState` only for UI state (open/closed dialogs, etc.).
- **Types:** Define TypeScript interfaces in `<feature>.types.ts`. Do not use `any`.
- **Imports:** Absolute paths (configured via `tsconfig.app.json`). Relative paths only within the same feature directory.

---

## Adding a New Backend Feature Module

Use this checklist when adding a resource (e.g., a `Lecture` model).

### 1. Create the model (`src/models/lecture.model.js`)

```js
const mongoose = require("mongoose");
const Joi = require("joi");

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // ... other fields
  },
  { timestamps: true },
);

const Lecture = mongoose.model("Lecture", lectureSchema);

function validateLecture(data) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    // ... mirror schema fields
  });
  return schema.validate(data);
}

exports.Lecture = Lecture;
exports.validate = validateLecture;
```

### 2. Create the controller (`src/controllers/lecture.controller.js`)

```js
const mongoose = require("mongoose");
const { Lecture, validate } = require("../models/lecture.model");

exports.getLectures = async (req, res) => {
  const items = await Lecture.find();
  res.status(200).json(items);
};

exports.createLecture = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const lecture = new Lecture(req.body);
  await lecture.save();
  res.status(201).json(lecture);
};

exports.updateLecture = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updated = await Lecture.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Lecture not found" });
  res.status(200).json(updated);
};

exports.deleteLecture = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  const deleted = await Lecture.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Lecture not found" });
  res.status(200).json({ message: "Lecture deleted" });
};
```

### 3. Create the router (`src/routes/lecture.routes.js`)

```js
const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const c = require("../controllers/lecture.controller");

router.get("/", asyncMiddleware(c.getLectures));
router.post("/", authMiddleware, asyncMiddleware(c.createLecture));
router.put("/:id", authMiddleware, asyncMiddleware(c.updateLecture));
router.delete("/:id", authMiddleware, asyncMiddleware(c.deleteLecture));

module.exports = router;
```

### 4. Mount the router in `src/app.js`

```js
const lectures = require("./routes/lecture.routes");
// ...
app.use("/api/lectures", lectures);
```

### 5. Write tests

- `tests/unit/controllers/lecture.controller.test.js` — mock the model, test each handler.
- `tests/unit/models/lecture.validation.test.js` — test the Joi schema.
- `tests/integration/lecture.routes.test.js` — Supertest against MongoDB Memory Server.

### 6. Document the new endpoints in `backend/README.md`.

---

## Adding a New Frontend Admin Feature Module

Use this checklist when adding an admin resource UI (e.g., `Lectures`).

### 1. Define types (`src/admin/features/lectures/lectures.types.ts`)

```ts
export interface Lecture {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type LectureFormValues = Omit<Lecture, "_id" | "createdAt" | "updatedAt">;
```

### 2. Define the Zod schema (`src/admin/features/lectures/lecture.schema.ts`)

```ts
import { z } from "zod";

export const lectureSchema = z.object({
  title: z.string().min(3).max(255),
});

export type LectureFormValues = z.infer<typeof lectureSchema>;
```

### 3. Add service functions (`src/services/lectures.api.ts`)

```ts
import api from "./apiClient";
import type { LectureFormValues } from "../admin/features/lectures/lecture.schema";

export const getLectures = async () => {
  const { data } = await api.get("/lectures");
  return data;
};

export const createLecture = (payload: LectureFormValues) =>
  api.post("/lectures", payload);

export const updateLecture = (id: string, payload: LectureFormValues) =>
  api.put(`/lectures/${id}`, payload);

export const deleteLecture = (id: string) =>
  api.delete(`/lectures/${id}`);
```

### 4. Add React Query hooks (`src/hooks/useLectures.ts`)

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLectures, createLecture, updateLecture, deleteLecture } from "../services/lectures.api";

export const useLectures = () =>
  useQuery({ queryKey: ["lectures"], queryFn: getLectures });

export const useCreateLecture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLecture,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lectures"] }),
  });
};

// useUpdateLecture, useDeleteLecture follow the same pattern
```

### 5. Create the feature components

```
src/admin/features/lectures/
  LecturesPage.tsx      — wires hooks to Table + Dialog
  LecturesTable.tsx     — MUI DataGrid, row edit/delete actions
  LectureDialog.tsx     — react-hook-form + Zod, create/edit mode via initialData
  lecture.schema.ts     — (created above)
  lectures.types.ts     — (created above)
```

### 6. Register the route

In `src/admin/routes.tsx`, add:

```ts
import LecturesPage from "./features/lectures/LecturesPage";
// ...
{ path: "lectures", element: <LecturesPage /> },
```

### 7. Add a Sidebar link

In `src/admin/components/Sidebar.tsx`, add an entry for the new route.
