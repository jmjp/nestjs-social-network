import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/shared/services/firebase/firebase.service';
import { UsersService } from 'src/shared/services/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: FirebaseService
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies.teamfan_sign;
    if (!cookie) {
      throw new UnauthorizedException();
    }
    return this.authService.validateToken(cookie).then((user) => {
      request.body.user = user.uid;
      return true;
    }).catch((error) => {
      throw new UnauthorizedException(error);
    })
  }
}
