import { Client, Intents, MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import config from '../../config';
import { database } from '../database-schema'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.login(config.token).then(async () => {
  console.log("Prepping the meal list for the week");
  const channel = await client.channels.fetch(config.channelId)
  if (!(channel instanceof TextChannel)) throw 'bad channel'

  const db = await database()
  const { meals } = db.data

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setEmoji('♻️')
        .setCustomId('redraw-meals')
        .setLabel('Redraw meals')
        .setStyle('SECONDARY'),
    );

    const mealEmbeds = meals.map((meal) => {
      return {
        title: meal.name,
        url: meal.recipeUrl ? meal.recipeUrl : undefined,
      }
    })

  await channel.send({
    content: `I've prepped a list of meals for this week :cook:`,
    embeds: mealEmbeds,
    components: [row]
  });

  console.log("Meals have been prepped for the week. Bon Appétit!");
  client.destroy();
});
