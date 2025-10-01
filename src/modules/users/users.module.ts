
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common';

@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
