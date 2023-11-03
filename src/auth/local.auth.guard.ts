import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.session?.autorized) {
      return true;
    }

    throw new UnauthorizedException;
  }
}
