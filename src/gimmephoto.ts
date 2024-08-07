import {
  EmbedBuilder,
  Message,
} from "discord.js";

import { gimmePhoto, RedditError, type RedditResponse } from "./api";

type GimmePhotoParam = {
    name: string,
    count: number, 
    message: Message<boolean>
}

export class GimmePhotoCommand {
  name = "gimmephoto";

  async execute(params: GimmePhotoParam): Promise<void> {
    let channel = params.message.channel;

    try {
      let response = await gimmePhoto({
        subReddit: params.name,
        count: params.count,
      });

      if (response instanceof RedditError) {
        await params.message.reply(
          `Error ${response.message} with code ${response.code}`
        );
        return;
      }
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

      if (channel) {
        channel.send({ embeds: embeds });
        return;
      } else {
        await params.message.reply({ embeds: embeds });
      }
    } catch (err) {
      console.error(err);
      await params.message.reply("Error!");
    }
  }
}
