import { Contains, IsNotEmpty } from "class-validator";

export class MediaEntry {
    @IsNotEmpty()
    @Contains(process.env.BUCKET_PUBLIC_URL)
    url: string;

    @IsNotEmpty()
    ref: string;

    @IsNotEmpty()
    hash: string;

    id?: string;

}
