import { ApiProperty } from "@nestjs/swagger";

export class CreateTeamMemberDto {
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: false })
  roleId?: string;
  @ApiProperty({ required: false })
  departmentId?: string;
}

export class CreateUserDto {
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  email?: string;
  @ApiProperty({ required: false })
  phone?: string;
  @ApiProperty({ required: false })
  gender?: string;
  @ApiProperty({ required: false })
  employeeId?: number;
  @ApiProperty({ required: false })
  roleId?:  string;
  @ApiProperty({ required: false })
  departmentId?: string;
  @ApiProperty({ required: false })
  password?: string;
  @ApiProperty({ required: false })
  department?: string;
  @ApiProperty({ required: false })
  role?: string;
  @ApiProperty({ required: false })
  id?: string;
  @ApiProperty({ required: true })
  restaurantId ?:string
}
