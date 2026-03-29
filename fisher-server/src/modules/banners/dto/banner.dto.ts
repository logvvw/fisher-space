import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BannerPosition, BannerStatus } from '../entities/banner.entity';

export class CreateBannerDto {
  @IsOptional() @IsString() title?: string;
  @IsString() image: string;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsEnum(BannerPosition) position?: BannerPosition;
  @IsOptional() @Type(() => Number) @IsNumber() sortOrder?: number;
  @IsOptional() @IsEnum(BannerStatus) status?: BannerStatus;
}

export class UpdateBannerDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsEnum(BannerPosition) position?: BannerPosition;
  @IsOptional() @Type(() => Number) @IsNumber() sortOrder?: number;
  @IsOptional() @IsEnum(BannerStatus) status?: BannerStatus;
}
