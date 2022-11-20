import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller('v1/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  async health(@Req() req: Request, @Res() res: Response) : Promise<any> {
    return res.json({status: "up"});
  }
}
