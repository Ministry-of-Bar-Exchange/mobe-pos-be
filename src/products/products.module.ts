import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { PrismaModule } from "prisma/prisma.module";
import { CategoryModule } from "category/category.module";
import { SubCategoryModule } from "sub-category/sub-category.module";

@Module({
  imports: [PrismaModule, CategoryModule, SubCategoryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
