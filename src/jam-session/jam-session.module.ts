import { Module } from '@nestjs/common';
import { JamSessionGateway } from './jam-session/jam-session.gateway';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [SongsModule],
  providers: [JamSessionGateway],
})
export class JamSessionModule {}
