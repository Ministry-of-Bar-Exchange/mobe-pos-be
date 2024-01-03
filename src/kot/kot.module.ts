import { Module } from "@nestjs/common";
import { KotService } from "./kot.service";
import { KotController } from "./kot.controller";
import { PrismaModule } from "prisma/prisma.module";
import { ProductsModule } from "products/products.module";

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [KotController],
  providers: [KotService],
  exports: [KotService],
})
export class KotModule {}
