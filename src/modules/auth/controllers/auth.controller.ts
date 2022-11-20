import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Provider } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UsersService } from 'src/shared/services/users/users.service';
import { v4 } from 'uuid';
import { FirebaseService } from '../../../shared/services/firebase/firebase.service';

@Controller('v1/auth')
export class AuthController {
    constructor(private firebaseService: FirebaseService, private userService: UsersService) { }
    @Post()
    async handle(@Req() req: Request, @Res() res: Response) {
        const token = req.body.token;
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const uuid = v4();
        const cookie = await this.firebaseService.generateCookie(token, expiresIn);
        const user = await this.firebaseService.retriveUserByToken(token);
        const create = await this.userService.upsert(
            {
                id: user.uid
            },
            {
                id: user.uid ?? undefined,
                provider: user.firebase.sign_in_provider.split('.')[0].toUpperCase() as Provider,
                avatar: user.picture ?? undefined,
                email: user.email ?? undefined,
                username: uuid,
            },
            {
                avatar: user.picture ?? undefined,
                email: user.email ?? undefined,
                provider: user.firebase.sign_in_provider.split('.')[0].toUpperCase() as Provider,
            }
        )
        res.cookie("teamfan_sign", cookie, {
            maxAge: expiresIn,
            httpOnly: true
        })
        return res.json(create);
    }

    @Get()
    @UseGuards(AuthGuard)
    async me(@Req() req: Request, @Res() res: Response) {
        return res.json({ status: "Ok" });
    }
}
