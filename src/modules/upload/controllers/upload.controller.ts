import { Controller, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Query, Req, Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { v4 } from 'uuid';
import { R2Service } from '../services/r2.service';
import { UploadEntry } from '../validators/upload-entry';

@Controller('v1/upload')
@UseGuards(AuthGuard)
export class UploadController {
    constructor(private uploadService: R2Service){}
    @Get()
    async handle(@Req() req: Request ,@Query() query: UploadEntry, @Res() res: Response){
        //return credentials to front-end upload
        //credentials expires in 3600ms (5m)
        const uuid = v4();
        const ref = `${req.body.user}/${query.type}/${uuid}.${query.mime}`;
        const upload = await this.uploadService.getCredentials(ref);
        return res.json({url: upload, link: `${process.env.BUCKET_PUBLIC_URL}/${ref}`, ref: ref});
    }
}
