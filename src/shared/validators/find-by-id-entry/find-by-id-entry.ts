import { IsNotEmpty, IsString, Length } from "class-validator";

export class FindByIdEntry {
    @IsNotEmpty()
    @IsString()
    id: string;
}
