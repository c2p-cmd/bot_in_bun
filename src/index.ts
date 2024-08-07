import {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} from "discord.js";
import {
  type RedditParams,
  type RedditResponse,
  type RedditError,
  gimmePhoto,
} from "./api";

let otto = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],
});

otto.on(Events.ClientReady, () => {
  console.log(`${otto.user?.tag ?? "Otto-E"} is ready! 🎉`);
});

otto.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  try {
    let text = message.content;
    if (text.toString().length == 0) {
      await message.reply("Empty message?, Error bro!");
      return;
    }

    if (!text.startsWith("!otto")) return;

    if (text.startsWith("!otto fetch")) {
      let args = text.split(" ");

      if (args.length < 3) {
        let embed = new EmbedBuilder()
          .setTitle("Invalid command format.")
          .addFields(
            {
              name: "use command with count",
              value: "!otto fetch [subRedditName] [count]",
            },
            {
              name: "use command or without",
              value: "!otto fetch [subRedditName]",
            }
          );

        await message.reply({ embeds: [embed] });
        return;
      }

      let name = args[2];
      var count = args.length === 4 ? parseInt(args[3], 10) : 1;
      count = isNaN(count) ? 1 : count;

      await message.channel.sendTyping();
      let response = await gimmePhoto({
        subReddit: name,
        count: count,
      });

      if ("code" in response && "message" in response) {
        await message.reply(
          `Error ${response.message} with code ${response.code}`
        );
        return;
      }

      console.log(response);
      console.log(typeof response);

      let redditResponses: [RedditResponse] = response;
      let embeds = redditResponses.map((redditResponse) => {
        let embed = new EmbedBuilder()
          .setTitle(redditResponse.title)
          .setImage(redditResponse.preview[redditResponse.preview.length - 1]);

        if (redditResponse.nsfw || redditResponse.spoiler) {
          embed.setColor(0xe0300f);
        }
        return embed;
      });

      await message.channel.send({ embeds: embeds });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await message.reply(`Something went wrong! 🤖\n${error}`);
  }
});

otto.login(process.env["API_KEY"]);
