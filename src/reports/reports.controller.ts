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

  @Get("/steward")
  getAllSaleBySteward(@Query() filters: any) {
    return this.reportsService.getAllSaleBySteward(filters);
  }

  @Get("/table")
  getAllSaleByTable(@Query() filters: any) {
    return this.reportsService.getAllSaleByTable(filters);
  }

  @Get("/cancelkot")
  getCancelKotAllItems(@Query() filters: CommonObjectType) {
    return this.reportsService.getCancelKotAllItems(filters);
  }

  @Get("/billreprint")
  getReprintedByDate(@Query() filters: CommonObjectType) {
    return this.reportsService.getReprintedByDate(filters);
  }
  @Get("/complimentary")
  getComplimentaryDataByDate(@Query() filters: CommonObjectType) {
    return this.reportsService.getComplimentaryDataByDate(filters);
  }
}
