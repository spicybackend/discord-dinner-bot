import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';
import config from '../config';

import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'dinnerdb.json')

type Meal = {
  name: string
  recipeUrl?: string
}
type Data = {
  meals: Meal[]
}
const adapter = new JSONFile<Data>(file)
const db = new Low<Data>(adapter)

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
  console.log('Order up!');
});

client.on('interactionCreate', async (interaction) => {
  await db.read()
  db.data ||= { meals: [] }
  const { meals } = db.data

  if (interaction.isCommand()) {
    const { commandName, options } = interaction;

    if (commandName === 'dinner') {
      if (options.getSubcommand() === 'list') {
        const mealList = meals.map((meal) => ` • ${meal.name}`).join('\n')
        return await interaction.reply(`Here's the menu :pinched_fingers:\n${mealList}`);
      } else if (options.getSubcommand() === 'add') {
        const name = options.getString('name');
        const recipeUrl = options.getString('recipe-url');

        if (recipeUrl && !recipeUrl.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
          return await interaction.reply(`Sorry, the recipe URL (${recipeUrl}) looks a bit butchered`);
        }

        meals.push({ name, recipeUrl })
        await db.write()
        return await interaction.reply(`Added ${name} to the menu!`);
      }
    }
  }

  if (interaction.isButton()) {
    const mealList = meals.map((meal) => ` • ${meal.name}`).join('\n')
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setEmoji('♻️')
          .setCustomId('redraw-meals')
          .setLabel('Redraw meals')
          .setStyle('SECONDARY'),
      );

    return await interaction.reply({
      content: `Here's a new list of meals for this week :cook: You'll be having:\n${mealList}\nBon Appétit!`,
      components: [row]
    });
  }
});

client.login(config.token);
