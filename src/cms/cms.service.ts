import { Inject, Injectable } from '@nestjs/common';
import { CreateCmDto } from './dto/create-cm.dto';
import { UpdateCmDto } from './dto/update-cm.dto';
import { AxiosInstance } from 'axios';

@Injectable()
export class CmsService {
  constructor(@Inject('HTTP_CMS') private readonly http: AxiosInstance) { }

  async passthruGet(url: string) {
    return this.http(url);
  }

  create(createCmDto: CreateCmDto) {
    return 'This action adds a new cm';
  }

  findAll() {
    return `This action returns all cms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cm`;
  }

  update(id: number, updateCmDto: UpdateCmDto) {
    return `This action updates a #${id} cm`;
  }

  remove(id: number) {
    return `This action removes a #${id} cm`;
  }
}
