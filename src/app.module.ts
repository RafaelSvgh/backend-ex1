import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RoomModule } from './modules/room/room.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './user/user.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [UsersModule, RoomModule, AuthModule, UserModule, AiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
