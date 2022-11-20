import { IsNotEmpty, MaxLength  } from "class-validator";

export class TagsEntry {
    @MaxLength(50)
    @IsNotEmpty()
    name: string;
    
    id?: string;
}
