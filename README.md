# 🌍 Travel & Weather Guide

An AI travel assistant built on the [OpenAI Agents SDK](https://github.com/openai/openai-agents-js).
Type in any city and get a concise rundown:

1. **Background** — what the place is known for
2. **Current Weather** — live data via [Open-Meteo](https://open-meteo.com/) (no API key needed)
3. **Seasonal Activities** — what people do there this time of year
4. **Visit Recommendation** — a clear verdict on whether now's a good time to go

It ships with both a **web UI** and a **command-line** version, sharing the same agent.

---

## Quick start

### 0. Use the right Node version

The Node version is pinned in `.nvmrc` (Node 22). If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use      # or: nvm install
```

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your environment

```bash
cp .env.example .env
```

Then open `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.4-mini   # optional
PORT=3000                   # optional
```

> Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
> `.env` is gitignored — your key never gets committed.

### 3. Run it

**Web UI:**

```bash
npm start
```

Then open <http://localhost:3000>.

**Command line:**

```bash
npm run cli
```

For development with auto-reload on file changes:

```bash
npm run dev
```

### Linting

The project uses [ESLint](https://eslint.org/) (flat config in `eslint.config.js`):

```bash
npm run lint       # report problems
npm run lint:fix   # auto-fix what it can
```

---

## Project structure

```
.
├── public/              # Web frontend (static)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── config.js        # Loads & validates environment variables
│   ├── agent.js         # Agent definition + runner
│   ├── server.js        # Express web server (npm start)
│   ├── cli.js           # Terminal version (npm run cli)
│   └── tools/
│       └── weather.js   # get_weather tool (Open-Meteo)
├── .env.example         # Template for your local .env
├── .nvmrc               # Pinned Node version (22)
├── eslint.config.js     # ESLint flat config
├── .gitignore
└── package.json
```

### How it fits together

- **`src/config.js`** is the single place that reads `process.env`. Everything else
  imports typed values from here, so secrets and settings stay in one spot.
- **`src/tools/weather.js`** defines the `get_weather` tool the agent can call.
- **`src/agent.js`** wires the tool into the agent and exposes a simple
  `askAboutCity(city)` helper.
- **`src/server.js`** serves the frontend and a single `POST /api/ask` endpoint.
- **`src/cli.js`** is a thin terminal loop over the same `askAboutCity` helper.

---

## API

The web server exposes one endpoint:

```
POST /api/ask
Content-Type: application/json

{ "city": "Lisbon" }
```

Response:

```json
{ "city": "Lisbon", "answer": "**Background**: ..." }
```

---

## Environment variables

| Variable         | Required | Default        | Description                          |
| ---------------- | -------- | -------------- | ------------------------------------ |
| `OPENAI_API_KEY` | ✅ Yes    | —              | Your OpenAI API key                  |
| `OPENAI_MODEL`   | No       | `gpt-5.4-mini` | Model the agent uses                 |
| `PORT`           | No       | `3000`         | Port for the web server              |

---

## License

ISC
