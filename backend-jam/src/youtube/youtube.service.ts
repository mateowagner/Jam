import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YoutubeService {
  constructor(private readonly config: ConfigService) {}

  async search(query: string) {
    const apiKey = this.config.get<string>('YOUTUBE_API_KEY');
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=5&type=video&key=${apiKey}`,
    );
    return res.json() as Promise<unknown>;
  }
}
