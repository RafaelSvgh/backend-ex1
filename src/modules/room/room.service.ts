import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class RoomService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(RoomService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Module initialized');
  }

  create(createRoomDto: CreateRoomDto) {
    const { adminId } = createRoomDto;

    const user = this.user.findUnique({
      where: { id: adminId, isActive: true },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.room.create({ data: createRoomDto });
  }

  findAll() {
    return `This action returns all room`;
  }

  async findOne(id: string) {
    const room = await this.room.findUnique({ where: { id } });
    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);
    return this.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.room.delete({ where: { id } });
  }

  async adminRoom(roomId: string) {
    const room = await this.room.findUnique({
      where: { id: roomId },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return room.admin;
  }

  async roomUsers(roomId: string) {
    const room = await this.room.findUnique({
      where: { id: roomId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return room.users.map((u) => u.user);
  }

  async addUserToRoom(roomId: string, userId: number) {
    const room = await this.room.findUnique({ where: { id: roomId } });
    console.log(room);
    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar que el usuario existe
    const user = await this.user.findUnique({ where: { id: userId } });
    console.log(user);
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar si el usuario ya está en la sala
    const existingUserRoom = await this.userRoom.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (existingUserRoom) {
      return existingUserRoom;
    }

    // Crear relación en UserRoom
    const userRoom = await this.userRoom.create({
      data: {
        userId,
        roomId,
      },
    });
    console.log(userRoom);
    return userRoom;
  }

  async getUsersByRoom(roomId: string) {
    const users = await this.userRoom.findMany({
      where: { roomId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return users.map((ur) => ur.user);
  }

  async removeUserFromRoom(roomId: string, userId: number) {
    const room = await this.findOne(roomId);
    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.userRoom.deleteMany({
      where: {
        roomId,
        userId,
      },
    });
  }

  

}
