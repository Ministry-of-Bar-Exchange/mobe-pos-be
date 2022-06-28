import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CmsModule } from 'src/cms/cms.module';

@Module({
  imports: [CmsModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }
