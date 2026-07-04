import readline from 'readline/promises';
import { askAboutCity } from './agent.js';

/**
 * Terminal version of the Travel & Weather Guide.
 * Ask for a city, print the rundown, repeat until "exit".
 */
async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n🌍 Travel & Weather Guide (type "exit" to quit)');

  while (true) {
    const city = (await rl.question('\nEnter a city or town name: ')).trim();

    if (!city || city.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      break;
    }

    console.log(`\n--- Getting info for '${city}' ---\n`);
    try {
      console.log(await askAboutCity(city));
    } catch (err) {
      console.error('Something went wrong:', err.message);
    }
  }

  rl.close();
}

await main();
