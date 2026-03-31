import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    const adminId = req.user.id;
    return this.roomsService.create({ ...createRoomDto, admin_id: adminId });
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/members')
  addMember(
    @Param('id') roomId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { canPlay: boolean },
  ) {
    return this.roomsService.addMember(roomId, req.user.id, body.canPlay);
  }
}
