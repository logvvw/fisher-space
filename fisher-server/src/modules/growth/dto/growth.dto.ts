import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGrowthDto {
  @Type(() => Number) @IsNumber() venueId: number;
  @IsString() name: string;
  @Type(() => Number) @IsNumber() currentWeight: number;
  @IsOptional() @Type(() => Number) @IsNumber() lastWeight?: number;
  @IsDateString() recordedAt: string | Date;
}

export class UpdateGrowthDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @Type(() => Number) @IsNumber() currentWeight?: number;
  @IsOptional() @Type(() => Number) @IsNumber() lastWeight?: number;
  @IsOptional() @IsDateString() recordedAt?: string | Date;
}
