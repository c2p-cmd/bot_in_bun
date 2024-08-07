export interface RedditParams {
  subReddit: string;
  count: number;
}

export class RedditError {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

interface Result {
  count: number,
  memes: [RedditResponse]
}

export class RedditResponse {
  title: string;
  nsfw: boolean;
  spoiler: boolean;
  ups: number;
  preview: Array<string>;

  constructor(title: string, nsfw: boolean, spoiler: boolean, ups: number, preview: Array<string>) {
    this.title = title;
    this.nsfw = nsfw;
    this.spoiler = spoiler;
    this.ups = ups;
    this.preview = preview;
  }
}

export async function gimmePhoto(
  params: RedditParams
): Promise<RedditError | [RedditResponse]> {
  if (params.count <= 0 || params.count > 50) {
    throw Error(
      "Invalid number of photos to fetch. Please choose a number between 1 & 50!"
    );
  }

  if (params.subReddit === '---') {
    throw Error("Invalid SubReddit name!");
  }

  try {
    let url = `https://meme-api.com/gimme/${params.subReddit}/${params.count}`;

    let response = await fetch(url);
    let jsonResponse = await response.text();
    if (response.status != 200) {
      let json = JSON.parse(jsonResponse);
      return new RedditError(json.code, json.message);
    }

    let redditResponse: Result = JSON.parse(jsonResponse);
    return redditResponse.memes;
  } catch (err) {
    console.error(err);
    return new RedditError(500, `Error ${err}`);
  }
}