import { IsNotEmpty } from "class-validator";

export class UploadEntry {
    @IsNotEmpty()
    mime: string;

    @IsNotEmpty()
    type: string;
}
