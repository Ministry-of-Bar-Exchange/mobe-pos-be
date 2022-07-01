import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    const userData = {
      ...createUserDto,
      password: hashPassword,
    };
    return new this.userModel(userData).save();
  }

  async login(createUserDto: CreateUserDto, jwtService) {
    const { email, password } = createUserDto;
    let loginSuccess = {};
    const adminData = await await this.userModel.find({ email }).exec();
    const isMatch = await bcrypt.compare(password, adminData?.[0].password);
    if (isMatch) {
      const accessToken = await jwtService?.signAsync({
        id: adminData?.[0]._id,
      });
      if (accessToken) {
        const filter = { _id: adminData?.[0]._id };
        const update = { accessToken: accessToken };
        loginSuccess = await this.userModel
          .findOneAndUpdate(filter, update)
          .exec();
      }
      //   console.log('SSSSS ==> ', loginSuccess);
      return loginSuccess;
    } else {
      //  console.log('ERORR IN JWT');
    }
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: ObjectId) {
    return await this.userModel.findOne({ _id: id });
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndReplace({ _id: id }, updateUserDto);
  }

  async remove(id: ObjectId) {
    return await this.userModel.remove({ _id: id })
  }
}
