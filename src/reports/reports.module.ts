import { Module } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { PrismaModule } from "prisma/prisma.module";
import { CategoryModule } from "category/category.module";
import { SubCategoryModule } from "sub-category/sub-category.module";

@Module({
  imports: [PrismaModule, CategoryModule, SubCategoryModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
