import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Body, Delete, Put, Query } from '@nestjs/common/decorators';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FindByIdEntry } from 'src/shared/validators/find-by-id-entry/find-by-id-entry';
import { Pagination } from 'src/shared/validators/pagination/pagination';
import { PostService } from '../../services/post.service';
import { MediaEntry } from '../../validators/media-entry/media-entry';
import { PostEntry } from '../../validators/post-entry/post-entry';
import { PostUpdateEntry } from '../../validators/post-update-entry/post-update-entry';
import { TagsEntry } from '../../validators/tags-entry/tags-entry';
import { ForbiddenException  } from '@nestjs/common/exceptions';
import { R2Service } from 'src/modules/upload/services/r2.service';

@Controller('v1/comments')
@UseGuards(AuthGuard)
export class CommentsController {
    constructor(private postService: PostService, private uploadService: R2Service) { }
    @Get('/:id')
    async findAll(@Req() req: Request, @Param() param: FindByIdEntry, @Query() pagination: Pagination, @Res() res: Response) {
        const user = req.query.user;
        const comments = await this.postService.posts(user == undefined ? undefined : {
            where: {
                postId: param.id
            },
            orderBy: {
                createAt: 'desc'
            },
            include: {
                media: true,
                tags: true,
                _count: true
            },
        }, {
            max: pagination.max ?? 100,
            page: pagination.page ?? 1
        });
        return res.json(comments);
    }
    // @Get('/:id')
    // async findOne(@Param() req: FindByIdEntry, @Res() res: Response) {
    //     const post = await this.postService.post({ id: req.id })
    //     if(!post){
    //        throw new  NotFoundException()
    //     }
    //     return res.json(post);
    // }
    @Post('/:id')
    async create(@Req() req: Request, @Param() param: FindByIdEntry, @Body() body: PostEntry, @Res() res: Response) {
        const { content, tags, media } = body;
        const post = await this.postService.create(
            {
                content: content,
                post: {
                    connect: {
                        id: param.id
                    }
                },
                tags: {
                    connectOrCreate: tags.map((tag: TagsEntry) => ({
                        create: {
                            tag: tag.name
                        },
                        where: {
                            tag: tag.name
                        }
                    }))
                },
                media: {
                    createMany: {
                        data: media.map((media: MediaEntry) => ({
                            url: media.url,
                            bucketRef: media.ref,
                            blurHash: media.hash,
                            userId: req.body.user
                        }))
                    }
                },
                user: {
                    connect: {
                        id: req.body.user
                    }
                }
            }
        )
        return res.json(post);
    }
    @Put('/:commentId')
    async update(@Req() req: Request, @Param() param: FindByIdEntry, @Body() body: PostUpdateEntry, @Res() res: Response) {
        const find = await this.postService.posts({
            where: {
                AND: {
                    userId: req.body.user,
                    id: req.params.commentId,
                }
            },
        }, {
            max: 1,
            page: 1
        })
        if (!find) {
            throw new ForbiddenException();
        }
        const update = await this.postService.updatePost({
            where: {
                id: param.id
            },
            data: {
                content: body.content ?? undefined,
                tags: {
                    connectOrCreate: body.tagsConnect.map((tag: TagsEntry) => ({
                        create: {
                            tag: tag.name
                        },
                        where: {
                            tag: tag.name
                        }
                    })),
                    disconnect: body.tagsDisconnect.map((tag: TagsEntry) => ({
                        id: tag.id
                    }))
                },
                media: {
                    createMany: {
                        data: body.mediaConnect.map((media: MediaEntry) => ({
                            url: media.url,
                            bucketRef: media.ref,
                            blurHash: media.hash,
                            userId: req.body.user
                        }))
                    },
                    disconnect: body.mediaDisconnect.map((media: MediaEntry) => ({
                        id: media.id
                    }))
                }
            }
        })
        return res.json(update);
    }
    @Delete('/:id')
    async delete(@Req() req: Request, @Param() param: FindByIdEntry, @Res() res: Response) {
        const find = await this.postService.findPostToNextAction({
            where: {
                AND: {
                    userId: req.body.user,
                    id: param.id
                }
            }
        })
        if (!find) {
            throw new ForbiddenException();
        }
        find.media.forEach((data) => this.uploadService.deleteObject(data.bucketRef));
        const deletePost = await this.postService.deletePost({
            id: param.id
        })
        return res.json(deletePost);
    }

}

