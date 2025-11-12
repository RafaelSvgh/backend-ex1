import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class UpdateDiagramDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsObject()
  @IsNotEmpty()
  diagram: any;
}