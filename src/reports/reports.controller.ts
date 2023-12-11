import { Body, Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CommonObjectType } from "types";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getAllItems(@Query() filters: any) {
    return this.reportsService.getAllItems(filters);
  }

  @Get('/steward')
  getAllSaleBySteward(@Query() filters: any) {
    return this.reportsService.getAllSaleBySteward(filters);
  }

  @Get('/table')
  getAllSaleByTable(@Query() filters: any) {
    return this.reportsService.getAllSaleByTable(filters);
  }
  @Get("/voidBillReports")
  getAllVoidReports(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllVoidReports(filters);
  }

  @Get("/discountReports")
  getAllDiscountReports(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllDiscountReports(filters);
  }
}
