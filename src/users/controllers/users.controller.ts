import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from '../services/user/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('getByToken')
  async getByToken(@Headers('Authorization') headers) {
    return await this.usersService.getByToken(headers.split(' ')[1]);
  }
}
