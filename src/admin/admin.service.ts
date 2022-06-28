import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminSchema, AdminDocument, Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AdminModule } from './admin.module';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const { email, password, name } = createAdminDto;
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const userData = {
      email: email,
      password: hashPassword,
      name: name,
    };

    const newUser = new this.adminModel(userData);
    return newUser.save();
  }

  async login(createAdminDto: CreateAdminDto, jwtService) {
    const { email, password } = createAdminDto;
    let loginSuccess = {};
    const adminData = await await this.adminModel.find({ email }).exec();
    const isMatch = await bcrypt.compare(password, adminData?.[0].password);
    if (isMatch) {
      const accessToken = await jwtService?.signAsync({
        id: adminData?.[0]._id,
      });
      if (accessToken) {
        const filter = { _id: adminData?.[0]._id };
        const update = { accessToken: accessToken };
        loginSuccess = await this.adminModel
          .findOneAndUpdate(filter, update)
          .exec();
      }
      console.log('SSSSS ==> ', loginSuccess);
      return loginSuccess;
    } else {
      console.log('ERORR IN JWT');
    }
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
