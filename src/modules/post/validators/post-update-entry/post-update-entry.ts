import { Type } from "class-transformer";
import { MaxLength, ValidateNested, ArrayMaxSize } from "class-validator";
import { MediaEntry } from "../media-entry/media-entry";
import { TagsEntry } from "../tags-entry/tags-entry";

export class PostUpdateEntry {
    @MaxLength(140)
    content?: string;
    
    @ValidateNested({ each: true })
    @ArrayMaxSize(10)
    @Type(() => TagsEntry)
    tagsConnect?: TagsEntry[]

    @ValidateNested({ each: true })
    @ArrayMaxSize(10)
    @Type(() => TagsEntry)
    tagsDisconnect?: TagsEntry[]

    @ValidateNested({ each: true })
    @ArrayMaxSize(3)
    @Type(() => MediaEntry)
    mediaConnect?: MediaEntry[]

    @ValidateNested({ each: true })
    @ArrayMaxSize(3)
    @Type(() => MediaEntry)
    mediaDisconnect?: MediaEntry[]
}
