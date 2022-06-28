import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CmsModule } from '../cms/cms.module'

@Module({
  imports: [CmsModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
