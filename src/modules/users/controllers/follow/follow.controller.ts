import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UsersService } from 'src/shared/services/users/users.service';
import { FindByIdEntry } from 'src/shared/validators/find-by-id-entry/find-by-id-entry';

@Controller('v1/users/follow')
@UseGuards(AuthGuard)
export class FollowController {
    constructor(private userService: UsersService){}
    @Post()
    async follow(@Req() req: Request ,@Body() body: FindByIdEntry, @Res() res: Response) {
        const follow = await this.userService.updateUser({
            where: {
                id: req.body.user
            },
            data: {
                following: {
                    connect: {
                        id: body.id
                    }
                }
            }
        })
        return res.json(follow);
    }
    @Get('/:id')
    async userFollowers(@Param() param: FindByIdEntry, @Res() res: Response) {
        const users = await this.userService.users({
            where: {
                followers: {
                    some: {
                        id: param.id
                    }
                }
            }
        });
        return res.json(users);
    }
    @Get('/following/:id')
    async userFollowing(@Param() param: FindByIdEntry, @Res() res: Response) {
        const users = await this.userService.users({
            where: {
                following: {
                    some: {
                        id: param.id
                    }
                }
            }
        });
        return res.json(users);
    }
    @Put()
    async unFollowing(@Req() req: Request ,@Body() body: FindByIdEntry, @Res() res: Response) {
        const follow = await this.userService.updateUser({
            where: {
                id: req.body.user
            },
            data: {
                following: {
                    disconnect: {
                        id: body.id
                    }
                }
            }
        })
        return res.json(follow);
    }
}
