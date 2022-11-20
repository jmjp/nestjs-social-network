import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    async user(
        userWhereUniqueInput?: Prisma.UserWhereUniqueInput,
        userInclude?: Prisma.UserInclude
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput ?? undefined,
            include: userInclude ?? undefined
        });
    }
    async users(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
        include?: Prisma.UserInclude;
    }): Promise<User[]> {
        if(!params){
            params = {}
        }
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        })
    }
    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }
    async upsert(where: Prisma.UserWhereUniqueInput, create: Prisma.UserCreateInput, update: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.upsert({
            where,
            create,
            update
        })
    }
}
