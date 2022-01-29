import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
  .setName('dinner')
  .setDescription('Get info about a user or a server!')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Info about a user')
      .addStringOption((option) => option.setName('name').setDescription('Name of the meal').setRequired(true))
      .addStringOption((option) => option.setName('recipe-url').setDescription('Link to the recipe').setRequired(false))
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('Info about the server')
  )
