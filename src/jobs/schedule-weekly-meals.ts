import { CategoryChannel, Client, Intents, MessageActionRow, MessageButton, StageChannel, TextChannel } from 'discord.js';
import config from '../../config';
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../dinnerdb.json')

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

client.login(config.token).then(async () => {
  console.log("Prepping the meal list for the week");

  const channel = await client.channels.fetch(config.channelId)
  if (!(channel instanceof TextChannel)) throw 'bad channel'

  await db.read()
  db.data ||= { meals: [] }
  const { meals } = db.data

  const mealList = meals.map((meal) => ` • ${meal.name}`).join('\n')
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setEmoji('♻️')
        .setCustomId('redraw-meals')
        .setLabel('Redraw meals')
        .setStyle('PRIMARY'),
    );

  await channel.send({
    content: `I've prepped a list of meals for this week :cook: You'll be having:\n${mealList}\nBon Appétit!`,
    components: [row]
  });

  console.log("Meals have been prepped for the week. Bon Appétit!");
  client.destroy();
});
