import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyJwt } from './jwt-auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyJwt(token);
    if (!payload) throw new UnauthorizedException('Invalid or expired token');
    req.user = payload;
    return true;
  }
} 