import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Request, Response } from 'express';
import { UsersService } from 'src/shared/services/users/users.service';
import { FindByIdEntry } from 'src/shared/validators/find-by-id-entry/find-by-id-entry';

@Controller('v1/users/find')
export class UsersController {
    constructor(private usersServices: UsersService) { }
    @Get()
    async find(@Req() req: Request, @Res() res: Response) {
        const users = await this.usersServices.users();
        return res.json(users);
    }
    @Get('/:id')
    async findOne(@Param() req: FindByIdEntry, @Res() res: Response) {
        const users = await this.usersServices.user({ id: req.id },
            {
                _count: true,
                followers: true,
                following: true,
                medias: true
            });
            if(!users){
                throw new  NotFoundException()
             }
        return res.json(users);
    }
}
