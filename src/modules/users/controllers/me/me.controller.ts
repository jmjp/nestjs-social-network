import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UsersService } from 'src/shared/services/users/users.service';
import { Request, Response } from 'express';
import { PostService } from 'src/modules/post/services/post.service';
import { Pagination } from 'src/shared/validators/pagination/pagination';
import { NotFoundException } from '@nestjs/common/exceptions';

@Controller('v1/users/me')
@UseGuards(AuthGuard)
export class MeController {
    constructor(private usersServices: UsersService, private postServices: PostService) { }
    @Get()
    async me(@Req() req: Request, @Res() res: Response) {
        const users = await this.usersServices.user({ id: req.body.user },
            {
                _count: true,
                followers: true,
                following: true,
                posts: {
                    take: 5,
                    orderBy: {
                        createAt: 'desc'
                    },
                }
            });
        if(!users){
            throw new NotFoundException();
        }
        return res.json(users);
    }

    @Get('feed')
    async feed(@Req() req: Request, @Res() res: Response, @Query() pagination: Pagination) {
        const feed = await this.postServices.posts({
            where: {
                user: {
                    followers: {
                        some: {
                            id: req.body.user
                        }
                    }
                }
            },
            orderBy: {
                createAt: 'desc'
            },
            include: {
                comments: {
                    take: 1,
                },
                media: true,
                _count: true,
            }
        },{
            max: pagination.max ?? 10,
            page: pagination.page ?? 1
        })
        return res.json(feed);
    }
}
