import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
  .setName('meals')
  .setDescription('View and manage the recipes for meal planning')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Add a new recipe to the mix')
      .addStringOption((option) => option.setName('name').setDescription('Name of the meal').setRequired(true))
      .addStringOption((option) => option.setName('recipe-url').setDescription('Link to the recipe').setRequired(false))
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('List out all of the recipes on rotation')
  )
