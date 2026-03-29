import { IsString, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum VenueStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OFFLINE = 'offline',
}

export class CreateVenueDto {
  @IsString() name: string;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @Type(() => Number) @IsNumber() area?: number;

  @IsOptional() 
  @IsArray() 
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  facilities?: string[];

  @IsOptional() @IsString() businessHours?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateVenueDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @Type(() => Number) @IsNumber() area?: number;

  @IsOptional() 
  @IsArray() 
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  facilities?: string[];

  @IsOptional() @IsString() businessHours?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(VenueStatus) status?: VenueStatus;
}
