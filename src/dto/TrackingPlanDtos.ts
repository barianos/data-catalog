import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class EventDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name: string = '';

    @IsString()
    @IsNotEmpty()
    type: string = '';

    @IsString()
    @IsNotEmpty()
    description: string = '';

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyDto)
    properties: PropertyDto[] = [];

    @IsNotEmpty()
    additionalProperties: boolean = false;
}

class PropertyDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name: string = '';

    @IsString()
    @IsNotEmpty()
    type: string = '';

    @IsString()
    @IsNotEmpty()
    description: string = '';

    @IsNotEmpty()
    required: boolean = false;
}

export class CreateTrackingPlanDto {
    @IsString()
    @IsNotEmpty()
    name: string = '';

    @IsString()
    @IsNotEmpty()
    description: string = '';

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventDto)
    events: EventDto[] = [];
}

export class GetTrackingPlanDto {
    @IsInt()
    @Min(1)
    id: number = 0;
}

export class UpdateTrackingPlanDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventDto)
    @IsOptional()
    events?: EventDto[];
}

export class DeleteTrackingPlanDto {
    @IsInt()
    @Min(1)
    id: number = 0;
}