import { Injectable  } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable()
export class R2Service {
    //r2 is a storage bucket from cloudflare with integration of s3 api's
    r2 = new S3
    ({
        endpoint: `https://${process.env.BUCKET_ACCOUNTID}.r2.cloudflarestorage.com`,
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET,
        signatureVersion: 'v4',
    });
    async getCredentials(key: string) {
        return this.r2.getSignedUrl('putObject', {
            Bucket: process.env.BUCKET_SECRET,
            Key: key,
            Expires: 1000,
        })
    }
    async deleteObject(key: string) {
        return this.r2.deleteObject({
            Bucket: process.env.BUCKET_SECRET,
            Key: key
        })
    }

}
