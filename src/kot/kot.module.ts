import { Module } from "@nestjs/common";
import { KotService } from "./kot.service";
import { KotController } from "./kot.controller";
import { PrismaModule } from "prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [KotController],
  providers: [KotService],
  exports: [KotService],
})
export class KotModule {}
