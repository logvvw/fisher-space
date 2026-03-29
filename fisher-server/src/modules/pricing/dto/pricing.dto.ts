import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingType } from '../entities/pricing.entity';

export class CreatePricingDto {
  @IsEnum(PricingType) type: PricingType;
  @Type(() => Number) @IsNumber() price: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdatePricingDto {
  @IsOptional() @IsEnum(PricingType) type?: PricingType;
  @IsOptional() @Type(() => Number) @IsNumber() price?: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
