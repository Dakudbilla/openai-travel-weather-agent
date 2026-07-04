import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * A tool the agent can call to fetch live weather.
 * Uses Open-Meteo, which is free and needs no API key.
 */
export const getWeather = tool({
  name: 'get_weather',
  description: 'Fetch current weather for a given city using Open-Meteo (no API key needed).',
  parameters: z.object({
    city: z.string().describe('The city or town name to check weather for'),
  }),
  execute: async ({ city }) => {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geo = await geoRes.json();

    if (!geo.results || geo.results.length === 0) {
      return `Could not find location data for '${city}'.`;
    }

    const { latitude, longitude, name, country } = geo.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weather = await weatherRes.json();
    const current = weather.current_weather;

    return `${name}, ${country}: ${current.temperature}°C, wind ${current.windspeed} km/h`;
  },
});
