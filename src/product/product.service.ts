import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CmsService } from '../cms/cms.service';

@Injectable()
export class ProductService {
  public constructor(
    private readonly cmsservice: CmsService,
  ) { }
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
    const allProducts: any = await this.cmsservice.passthruGet('/products?populate=*');
    return allProducts.data.data;
  }

  async findOne(id: number) {
    const singleProduct: any = await this.cmsservice.passthruGet('/products/' + id + '?populate=*');
    return singleProduct.data.data;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
