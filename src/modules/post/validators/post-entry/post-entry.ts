import { Type } from "class-transformer";
import { ArrayMaxSize, IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { MediaEntry } from "../media-entry/media-entry";
import { TagsEntry } from "../tags-entry/tags-entry";

export class PostEntry {
    @IsNotEmpty()
    @MaxLength(140)
    content: string;
    
    @ValidateNested({ each: true })
    @ArrayMaxSize(10)
    @Type(() => TagsEntry)
    tags: TagsEntry[]

    @ValidateNested({ each: true })
    @ArrayMaxSize(3)
    @Type(() => MediaEntry)
    media: MediaEntry[]
}
