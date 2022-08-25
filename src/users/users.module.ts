import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/user/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './controllers/users.controller';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET_KEY',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
