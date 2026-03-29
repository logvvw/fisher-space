import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { StockingStatus } from '../entities/stocking.entity';

export class CreateStockingDto {
  @Type(() => Number) @IsNumber() venueId: number;
  @IsString() fish: string;
  @Type(() => Number) @IsNumber() amount: number;
  @IsDateString() date: string | Date;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsEnum(StockingStatus) status?: StockingStatus;
}

export class UpdateStockingDto {
  @IsOptional() @IsString() fish?: string;
  @IsOptional() @Type(() => Number) @IsNumber() amount?: number;
  @IsOptional() @IsDateString() date?: string | Date;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsEnum(StockingStatus) status?: StockingStatus;
}
