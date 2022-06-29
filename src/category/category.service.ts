import { Injectable } from '@nestjs/common';
import { CmsService } from 'src/cms/cms.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  public constructor(
    private readonly cmsservice: CmsService,
  ) { }
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    const allcategories: any = await this.cmsservice.passthruGet('/categories');
    return allcategories.data.data;
  }

  async findOne(id: number) {
    const singleCategory: any = await this.cmsservice.passthruGet('/categories/' + id);
    return singleCategory.data.data;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
