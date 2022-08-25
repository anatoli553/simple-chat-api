import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserInput } from '../../users/inputs/login-user.input';
import { CreateUserInput } from '../../users/inputs/create-user.input';
import { UsersService } from '../../users/services/user/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { rooms } from '../../chat/chat.gateway';

const users = [];

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userLoginInput: LoginUserInput, response) {
    try {
      const user = await this.validateUser(userLoginInput);
      if (user) {
        const token = await this.generateToken(userLoginInput);
        return { token, rooms };
      } else {
        throw new HttpException(
          'Check login and password',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      return e;
    }
  }

  async registration(userCreateInput: CreateUserInput, response) {
    try {
      const [candidate] = users.filter((el) => {
        if (el.username == userCreateInput.username) {
          return el;
        }
      });
      if (candidate) {
        throw new HttpException(
          'User with such username has already been registered',
          HttpStatus.BAD_REQUEST,
        );
      }
      userCreateInput.password = await bcrypt.hash(userCreateInput.password, 5);
      const user = {
        username: userCreateInput.username,
        password: userCreateInput.password,
      };
      users.push(user);
      const token = await this.generateToken(user);
      return { token, rooms };
    } catch (e) {
      return e;
    }
  }

  async generateToken(user) {
    try {
      const payload = {
        username: user.username,
      };
      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '30d',
        }),
      };
    } catch (e) {
      return e;
    }
  }

  async validateUser(candidate) {
    try {
      const [user] = users.filter((el) => {
        if (el.username == candidate.username) {
          return el;
        }
      });
      if (!user) {
        return undefined;
      } else {
        if (await bcrypt.compare(candidate.password, user.password)) {
          return user;
        } else {
          return undefined;
        }
      }
    } catch (e) {
      return e;
    }
  }
}
