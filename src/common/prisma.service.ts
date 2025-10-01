import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PrismaService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to the database');
  }
}
