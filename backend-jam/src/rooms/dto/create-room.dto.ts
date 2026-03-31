import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
export class CreateRoomDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;
  @IsString()
  @IsOptional()
  admin_id?: string;
}
