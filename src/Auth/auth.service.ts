import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'users/users.service';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.debug('\n authService \n', user, '\n user \n');
    // const matchedPassword = await bcrypt.compare(pass, user.passwordHash).then(match => match)
    // if (user && matchedPassword) {
    //   const { passwordHash, ...result } = user;
    //   return result;
    // }
    const matchPass = await bcrypt.compare(pass, user?.password);
    console.log(matchPass);
    return null;
  }

  async loginUser(loginDto: LoginDto) {
    try {
      if (loginDto) {
        const particularUser = await this.prisma.user.findFirst({
          where: {
            email: loginDto.email,
          },
        });
        const matchPassword = await bcrypt.compare(
          loginDto?.password,
          particularUser?.password,
        );
        console.log(particularUser);

        if (particularUser && matchPassword) {
          const response = {
            access_token: this.jwtService.sign(loginDto),
            email: particularUser?.email,
            name: particularUser?.name,
            phone: particularUser?.phone,
            gender: particularUser?.gender,
            userId: particularUser?.id,
          };
          console.log(response);
          return response;
        }
      }
      throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
