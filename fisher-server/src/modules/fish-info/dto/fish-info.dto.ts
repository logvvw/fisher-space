import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFishInfoDto {
  @Type(() => Number) @IsNumber() venueId: number;
  @IsString() content: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() biteRate?: string;
  @IsOptional() @IsString() rules?: string;
}

export class UpdateFishInfoDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() biteRate?: string;
  @IsOptional() @IsString() rules?: string;
  @IsOptional() @IsBoolean() isTop?: boolean;
}
