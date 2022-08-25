import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}

  async getByToken(token) {
    const user = await this.jwtService.decode(token);
    return user;
  }
}
