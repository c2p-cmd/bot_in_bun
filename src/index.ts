import { Client, Events, GatewayIntentBits } from "discord.js";
import { GimmePhotoCommand } from "./gimmephoto";
import { EmbedBuilder } from "@discordjs/builders";

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
    let text = message.content.toLowerCase();
    if (text.toString().length == 0) {
      await message.reply("Empty message?, Error bro!");
      return;
    }

    if (!text.startsWith("!otto")) return;

    let args = text.split(" ");

    if (args.length < 3) {
      let embed = new EmbedBuilder()
        .setTitle("Hello I am otto. Pleased to meet you")
        .setDescription("Please try some of these commands")
        .addFields(
          {
            name: "Get Single Photo",
            value: "!otto gimme [subReddit]",
          },
          {
            name: "Get Multiple Photos",
            value: "!otto gimme [subReddit] [count]",
          }
        );

      await message.channel.send({ embeds: [embed] });
      return;
    }

    if (text.startsWith("!otto gimme") && args.length <= 4) {
      await message.channel.sendTyping();

      var count = parseInt(args[3]) ?? 1;
      count = isNaN(count) ? 1 : count;
      new GimmePhotoCommand().execute({
        name: args[2],
        count: count,
        message: message,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await message.reply(`Something went wrong! 🤖\n${error}`);
  }
});

try {
  console.log("Starting server");
  await otto.login(process.env["API_KEY"]);

  Bun.serve({
    fetch(req: Request): Response | Promise<Response> {
      let message = {
        "message" : "Otto lives!",
        "link" : "https://discord.com/oauth2/authorize?client_id=1270675148680335410&permissions=0&scope=bot%20applications.commands"
      };
      return Response.json(message);
    },
    port: 3000,
  });
} catch {
  console.error("Server ain't running");
}
