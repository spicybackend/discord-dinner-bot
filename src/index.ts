import { Client, Intents } from 'discord.js';
import config from '../config';

import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'dinnerdb.json')

type Meal = {
  name: string
  recipe?: string
}
type Data = {
  meals: Meal[]
}
const adapter = new JSONFile<Data>(file)
const db = new Low<Data>(adapter)

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const { commandName, options } = interaction;

    if (commandName === 'dinner') {
      await db.read()
      db.data ||= { meals: [] }
      const { meals } = db.data

      if (options.getSubcommand() === 'list') {
        const mealList = meals.map((meal) => ` • ${meal.name}`).join('\n')
        await interaction.reply(`Here's the menu :pinched_fingers:\n${mealList}`);
      } else if (options.getSubcommand() === 'add') {
        const name = options.getString('name');
        meals.push({ name })
        await db.write()
        await interaction.reply(`Added ${name} to the menu!`);
      }
    }
  } else if (interaction.isButton()) {
    await interaction.reply(`Not implemented... yet!`);
  }
});

client.login(config.token);
