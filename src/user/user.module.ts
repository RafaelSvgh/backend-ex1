import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { RoomService } from 'src/modules/room/room.service';

@Module({
  providers: [UserGateway, UserService, RoomService],
})
export class UserModule {}
