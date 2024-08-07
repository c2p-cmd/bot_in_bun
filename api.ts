export interface RedditParams {
    subReddit: string,
    count: number
}

export interface RedditError {
    code: number,
    message: string,
}

interface Result {
    count: number,
    memes: [RedditResponse]
}

export interface RedditResponse {
    title: string,
    nsfw: boolean,
    spoiler: boolean,
    ups: number,
    preview: Array<string>
}

export async function gimmePhoto(params: RedditParams): Promise<RedditError | [RedditResponse]> {
    if (params.count <= 0) {
        throw Error("Invalid number of photos to fetch!")
    }

    try {
        let url = `https://meme-api.com/gimme/${params.subReddit}/${params.count}`;

        let response = await fetch(url);
        let jsonResponse = await response.text();
        if (response.status != 200) {
            let err: RedditError = JSON.parse(jsonResponse);
            return err;
        }
    
        let redditResponse: Result = JSON.parse(jsonResponse);
        return redditResponse.memes;
    } catch (err) {
        console.error(err);
        return {
            code: 500,
            message: `Error: ${err}`
        };
    }
}