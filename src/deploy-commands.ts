import * as fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	for (const file of commandFiles) {
		const command = await import(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}

	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
