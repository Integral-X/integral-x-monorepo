import { Module } from '@nestjs/common';
import { AuthModule as BaseAuthModule } from '../../../libs/auth/src/auth.module';

@Module({
  imports: [BaseAuthModule],
})
export class AuthModule {} 