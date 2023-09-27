import { Module } from "@nestjs/common";
import { SubCategoryService } from "./sub-category.service";
import { SubCategoryController } from "./sub-category.controller";
import { PrismaModule } from "prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
