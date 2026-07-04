import { Agent, Runner } from '@openai/agents';
import { MODEL } from './config.js';
import { getWeather } from './tools/weather.js';

/**
 * The Travel & Weather Guide agent.
 * Given a city name, it returns a structured rundown: background, live weather,
 * seasonal activities, and a visit recommendation.
 */
export const travelWeatherAgent = new Agent({
  name: 'Travel & Weather Guide',
  instructions: `You are a friendly travel guide assistant. When given a city or town name, respond with the following, in order:

1. **Background**: A brief 2-3 sentence overview of the city/town (what it's known for, region, culture, or history).
2. **Current Weather**: Use the get_weather tool to fetch live data, then state it clearly.
3. **Seasonal Activities**: Based on the current weather/season, describe what people typically do there this time of year.
4. **Visit Recommendation**: Give a clear verdict — is now a good time to visit or not — with a short reason.

Keep the whole response concise and well-organized with headers or bold labels for each section.`,
  model: MODEL,
  tools: [getWeather],
});

const runner = new Runner();

/**
 * Run the agent for a single city and return the final text output.
 * @param {string} city
 * @returns {Promise<string>}
 */
export async function askAboutCity(city) {
  const response = await runner.run(travelWeatherAgent, `Tell me about ${city}.`);
  return response.finalOutput;
}
