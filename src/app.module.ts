import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CmsModule } from './cms/cms.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [//MongooseModule.forRoot(process.env.MONGODB_URL),
    ConfigModule.forRoot(),
    CmsModule,
    ProductModule,
    CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
