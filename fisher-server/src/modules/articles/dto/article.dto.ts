import { IsString, IsOptional, IsEnum, IsArray, IsUrl } from 'class-validator';
import { ArticleCategory, ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  @IsString() title: string;
  @IsString() content: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() cover?: string;
  @IsEnum(ArticleCategory) category: ArticleCategory;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsEnum(ArticleStatus) status?: ArticleStatus;
}

export class UpdateArticleDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() cover?: string;
  @IsOptional() @IsEnum(ArticleCategory) category?: ArticleCategory;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsEnum(ArticleStatus) status?: ArticleStatus;
}
