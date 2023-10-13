import { Module } from "@nestjs/common";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { PrismaModule } from "prisma/prisma.module";
import { KotModule } from "kot/kot.module";

@Module({
  imports: [PrismaModule, KotModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
