import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';
import config from '../config';
import { addMeal, getAllMeals, getWeeklyMeals } from './resources/meals';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
  console.log('Order up!');
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const { commandName, options } = interaction;

    if (commandName === 'meals') {
      if (options.getSubcommand() === 'list') {
        const meals = await getAllMeals()
        const mealList = meals.map((meal) => ` • ${meal.name}`).join('\n')
        return await interaction.reply(`Here's the menu :pinched_fingers:\n${mealList}`);
      } else if (options.getSubcommand() === 'add') {
        const name = options.getString('name');
        const recipeUrl = options.getString('recipe-url');

        if (recipeUrl && !recipeUrl.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
          return await interaction.reply(`Sorry, the recipe URL (${recipeUrl}) looks a bit butchered`);
        }

        await addMeal({ name, recipeUrl })
        return await interaction.reply(`Added ${name} to the menu!`);
      }
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'redraw-meals') {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setEmoji('♻️')
            .setCustomId('redraw-meals')
            .setLabel('Redraw meals')
            .setStyle('SECONDARY'),
        );

      const meals = await getWeeklyMeals()
      const mealEmbeds = meals.map((meal) => {
        return {
          title: meal.name,
          url: meal.recipeUrl ? meal.recipeUrl : undefined,
        }
      })

      return await interaction.reply({
        content: `Here's a new list of meals for this week :cook:`,
        embeds: mealEmbeds,
        components: [row]
      });
    }
  }
});

client.login(config.token);
