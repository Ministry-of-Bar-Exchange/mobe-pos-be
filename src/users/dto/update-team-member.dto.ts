import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamMemberDto, CreateUserDto } from './create-team-member.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
