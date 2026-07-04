import 'dotenv/config';

/**
 * Centralised configuration.
 * All environment-specific values are read here so the rest
 * of the code never has to touch `process.env` directly.
 */

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(
      `\n✖ Missing required environment variable: ${name}\n` +
        `  Copy .env.example to .env and fill it in.\n`
    );
    process.exit(1);
  }
  return value;
}

// The Agents SDK reads OPENAI_API_KEY from the environment, so make sure it's set.
export const OPENAI_API_KEY = required('OPENAI_API_KEY');

// Model can be overridden per-deployment without touching code.
export const MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

// Port for the web server.
export const PORT = Number(process.env.PORT) || 3000;


