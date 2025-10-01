import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  id: string = 'ABC123';

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  diagram: string = '';

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  adminId: number;
}
