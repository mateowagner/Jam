import { IsString, MaxLength, IsOptional } from 'class-validator';
export class CreateSongDto {
  @IsString()
  @MaxLength(30)
  title: string;
  @IsString()
  video_id: string;
  @IsString()
  thumbnail: string;
  @IsString()
  room_id: string;
  @IsString()
  @IsOptional()
  added_by_id?: string;
}
