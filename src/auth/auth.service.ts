import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      const isValid = await bcrypt.compare(pass, user.password);
      if (user && isValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async signup(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    try {
      const { id } = await this.usersService.create(createUserDto);
      const accessToken = this.jwtService.sign({ id });
      return { accessToken };
    } catch (e) {
      //Opted to catch error and return a less verbose error for security reasons
      throw new InternalServerErrorException('Could not create user.');
    }
  }

  async login(user: LoginDto): Promise<{ accessToken: string }> {
    const { id } = await this.usersService.findOneByEmail(user.email);
    return {
      accessToken: this.jwtService.sign({ id }),
    };
  }
}
