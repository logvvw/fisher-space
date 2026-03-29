import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateTopicDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() isHot?: boolean;
  @IsOptional() @IsEnum(['active', 'inactive']) status?: 'active' | 'inactive';
}

export class UpdateTopicDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() isHot?: boolean;
  @IsOptional() @IsEnum(['active', 'inactive']) status?: 'active' | 'inactive';
}
