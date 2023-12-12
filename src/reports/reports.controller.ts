import { Body, Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CommonObjectType } from "types";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getAllItems(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItems(filters);
  }

  @Get("/steward")
  getAllSaleBySteward(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllSaleBySteward(filters);
  }

  @Get("/table")
  getAllSaleByTable(@Query() filters: CommonObjectType) {
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

  @Get("items")
  getAllItemSummary(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItemSummary(filters);
  }

  @Get("/nc")
  getAllItemComplementary(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItemComplementary(filters);
  }
  @Get("/nc-summary")
  getAllItemSummaryComplementary(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItemSummaryComplementary(filters);
  }

  @Get("options")
  getAllOptions() {
    return this.reportsService.getAllOptions();
  }
  
}
