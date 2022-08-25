import { Controller, Post, Body, Res } from '@nestjs/common';
import { CreateUserInput } from '../../users/inputs/create-user.input';
import { AuthService } from '../services/auth.service';
import { LoginUserInput } from '../../users/inputs/login-user.input';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: LoginUserInput, @Res({ passthrough: true }) response) {
    return this.authService.login(userDto, response);
  }
  @Post('/registration')
  registration(
    @Body() userDto: CreateUserInput,
    @Res({ passthrough: true }) response,
  ) {
    return this.authService.registration(userDto, response);
  }
}
