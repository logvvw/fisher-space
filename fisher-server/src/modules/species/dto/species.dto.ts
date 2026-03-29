import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum SpeciesCategory {
  FRESHWATER = 'freshwater',
  SALTWATER = 'saltwater',
}

export class CreateSpeciesDto {
  @Type(() => Number) @IsNumber() venueId: number;
  @IsString() name: string;
  @IsOptional() @IsEnum(SpeciesCategory) category?: SpeciesCategory;
  @IsOptional() @Type(() => Number) @IsNumber() avgWeight?: number;
  @IsOptional() @Type(() => Number) @IsNumber() quantity?: number;
}

export class UpdateSpeciesDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(SpeciesCategory) category?: SpeciesCategory;
  @IsOptional() @Type(() => Number) @IsNumber() avgWeight?: number;
  @IsOptional() @Type(() => Number) @IsNumber() quantity?: number;
}
