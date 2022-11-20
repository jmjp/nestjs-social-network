import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class Pagination {
    @Type(() => Number)
    @IsInt()
    page?: number

    @Type(() => Number)
    @IsInt()
    max?: number
}
