import { Injectable } from '@nestjs/common';
import { Media, Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Pagination } from 'src/shared/validators/pagination/pagination';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) { }
    async post(
        postWhereUniqueInput?: Prisma.PostWhereUniqueInput,
        postInclude?: Prisma.PostInclude,
    ): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: postWhereUniqueInput ?? undefined,
            include: postInclude ?? {
                media: true,
                tags: true,
                comments: {
                    take: 1,
                    orderBy: {
                        createAt: 'desc'
                    }
                },
                _count: true,
            }
        });
    }
    async posts(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PostWhereUniqueInput;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
        include?: Prisma.PostInclude;
    }, pagination?: Pagination){
        if (!params) {
            params = {
                orderBy: {
                    createAt: 'desc'
                },
                include: {
                    media: true,
                    tags: true,
                    _count: true,
                },
                take: pagination.max,
                skip: pagination.max * (pagination.page - 1)
            }
        }
        const { cursor, where, orderBy, include } = params;
        return this.prisma.post.findMany({
            skip: pagination.max * (pagination.page - 1),
            take: pagination.max,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findPostToNextAction(params?: {
        where?: Prisma.PostWhereInput
    }, pagination?: Pagination): Promise<Post & {
        media: Media[]
    }>{
        const { where } = params;
        return this.prisma.post.findFirst({
            where,
            include: {
                media: true,
            },
        });
    }



    async create(data: Prisma.PostCreateInput): Promise<Post> {
        return this.prisma.post.create({
            data,
        })
    }
    async updatePost(params: {
        where: Prisma.PostWhereUniqueInput;
        data: Prisma.PostUpdateInput;
    }): Promise<Post> {
        const { where, data } = params;
        return this.prisma.post.update({
            data,
            where,
        });
    }

    async deletePost(where: Prisma.PostWhereUniqueInput){
        return this.prisma.post.delete({
            where,
        })
    }
}
