import { IsString, IsIn, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string = '';

  @IsString()
  @IsIn(['string', 'number', 'boolean'])
  type: string = '';

  @IsString()
  description: string = '';

  @IsString()
  validationRules?: string;
}

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  description?: string;
}