
export class CreateTeamMemberDto {
  name: string;
  roleId: string;
  departmentId: string;
}

export class CreateUserDto {
  name: string;
  email: string;
  phone: string;
  gender: string;
  employeeId: string;
  roleId:  string;
  departmentId: string;
  password?: string;
  department?: string;
  role?: string;
}
