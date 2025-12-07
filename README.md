# GuppShupp AI Companion 🧠💬

This project is an AI companion prototype built on top of the official
**OpenAI Responses Starter App**.

On top of the original starter, it implements the **GuppShupp assignment requirements**:

* A **memory extraction module** that reads conversations and stores structured user memory
* A **personality / tone system** that can answer in multiple styles using the same base reply

---

## 1. What this app does

### 1.1 Base Chat (home page `/`)

* A simple multi-turn chat interface
* Uses **OpenAI Node SDK + OpenRouter**
* No tools, vector search, Google OAuth, MCP or connectors are required for this assignment
* The chat is implemented through a simple backend route using `chat.completions`

---

### 1.2 Memory Extraction (`/api/memory/extract`)

This module:

* Accepts a conversation (array of `{ role, content }`)
* Uses an LLM to infer **structured user memory**:

  * Preferences
  * Emotional patterns
  * Stable factual info worth remembering

The returned structure is:

```ts
type MemoryItem = {
  statement: string;
  confidence: number;
  evidenceMessageIndexes: number[];
};

type UserMemory = {
  preferences: MemoryItem[];
  emotionalPatterns: MemoryItem[];
  factsWorthRemembering: MemoryItem[];
};
```

How it works:

1. Reads the entire conversation
2. Infers stable user traits or facts
3. Produces structured JSON with confidence + evidence indices

#### 🔍 Test this endpoint:

Open in browser:

```
http://localhost:3000/api/memory/extract
```

It automatically uses:

```
data/sample-conversation.json
```

to demonstrate extraction.

---

### 1.3 Memory + Personality Chat

(`POST /api/memory_chat`  +  `/memory-demo` UI page)

This is the **core assignment flow**:

* User sends a message
* Selects a personality style
* Backend:

  1. Runs memory extractor
  2. Generates a neutral base reply using that memory
  3. Rewrites reply according to a selected personality

### ✨ Supported Personalities

* **neutral** – Neutral Assistant
* **calm_mentor** – Calm Mentor
* **witty_friend** – Witty Friend 😄
* **therapist_style** – Therapist-style Listener 🧠

Each personality changes tone, language and emojis — while preserving the same base meaning.

### 🧪 Personality Demo Page

Open in browser:

```
http://localhost:3000/memory-demo
```

You can:

* Write a user message
* Choose personality
* Press send
* See:

  * Final reply with selected tone
  * Extracted memory JSON used to generate the reply

---

## 2. Important Files (Assignment Highlights)

### Memory Module

* `lib/memory.ts`

  * Defines types: `ChatMessage`, `MemoryItem`, `UserMemory`
  * Implements `extractMemoryFromMessages(messages)`
  * Calls OpenRouter via OpenAI SDK
  * Returns structured memory JSON

* `data/sample-conversation.json`

  * A 12-turn student conversation
  * Used for demo memory extraction

---

### Personality System

* `lib/personality.ts`

  * Defines personalities
  * Applies personality rewrite on top of a base reply
  * Keeps semantic content stable

---

### API Routes

* `app/api/memory/extract/route.ts`

  * Loads sample conversation
  * Returns extracted memory only

* `app/api/memory_chat/route.ts`

  * Accepts `{ messages, personalityId }`
  * Extracts memory
  * Builds base reply
  * Applies personality
  * Returns structured result

* `app/api/turn_response/route.ts`

  * Simple multi-turn chat using `chat.completions`
  * No tools or connectors

---

### Frontend Demo Page

* `app/memory-demo/page.tsx`

  * React UI to test:

    * memory extraction
    * personality rewrite
  * Displays:

    * Final reply
    * Memory JSON

---

## 3. Tech Stack

* Next.js 15 (App Router)
* TypeScript + React
* OpenAI Node SDK
* OpenRouter as model provider
* Tailwind UI (from starter app)

---

## 4. Running Locally

### 4.1 Install dependencies

```bash
npm install
```

---

### 4.2 Environment Variables

Create a file:

```
.env.local
```

Not committed to git.

Add:

```bash
OPENAI_API_KEY=sk-or-********************************
OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

⚠️ Replace `OPENAI_API_KEY` with your **OpenRouter API key**

⚠️ `.env.local` is already gitignored (safe)

---

### 4.3 Start the app

```bash
npm run dev
```

Open in browser:

* Chat UI:

```
http://localhost:3000
```

* Memory + Personality Demo:

```
http://localhost:3000/memory-demo
```

---

## 5. Based on OpenAI Responses Starter App

This project originally forked from:

```
openai/openai-responses-starter-app
```

MIT licensed.

All original features (tools, vector search, Google OAuth, MCP servers) still exist,
but the **GuppShupp assignment logic lives in:**

* `lib/memory.ts`
* `lib/personality.ts`
* `data/sample-conversation.json`
* `app/api/memory/extract/route.ts`
* `app/api/memory_chat/route.ts`
* `app/memory-demo/page.tsx`

---

## 6. License

MIT License
See the `LICENSE` file.

---