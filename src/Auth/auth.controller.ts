import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { AuthGuard } from "./jwt-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public } from "./auth.public";
import { LoginDto } from "./dto/login-dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }
}
