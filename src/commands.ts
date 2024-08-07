import { SlashCommandBuilder } from "discord.js";

let fetchSomethingCommand = new SlashCommandBuilder()
  .setName("gimme photo")
  .setDescription(
    "Use this command to fetch image from subReddit of your choice"
  )
  .addStringOption((option) =>
    option
      .setName("subRedditName")
      .setDescription("SubReddit to fetch from")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("Count")
      .setDescription("Number of photos to fetch min. 1 & max. 50")
      .setRequired(false)
  );