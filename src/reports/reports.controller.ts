import { Body, Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CommonObjectType } from "types";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiBearerAuth("access-token")
  getAllItems(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItems(filters);
  }

  @Get("/steward")
  @ApiBearerAuth("access-token")
  getAllSaleBySteward(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllSaleBySteward(filters);
  }

  @Get("/table")
  @ApiBearerAuth("access-token")
  getAllSaleByTable(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllSaleByTable(filters);
  }
  @Get("/voidBillReports")
  @ApiBearerAuth("access-token")
  getAllVoidReports(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllVoidReports(filters);
  }

  @Get("/discountReports")
  @ApiBearerAuth("access-token")
  getAllDiscountReports(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllDiscountReports(filters);
  }

  @Get("/cancelkot")
  @ApiBearerAuth("access-token")
  getCancelKotAllItems(@Query() filters: CommonObjectType) {
    return this.reportsService.getCancelKotAllItems(filters);
  }

  @Get("/billreprint")
  @ApiBearerAuth("access-token")
  getReprintedByDate(@Query() filters: CommonObjectType) {
    return this.reportsService.getReprintedByDate(filters);
  }
  @Get("/complimentary")
  @ApiBearerAuth("access-token")
  getComplimentaryDataByDate(@Query() filters: CommonObjectType) {
    return this.reportsService.getComplimentaryDataByDate(filters);
  }

  @Get("items")
  @ApiBearerAuth("access-token")
  getAllItemSummary(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItemSummary(filters);
  }

  @Get("/nc")
  @ApiBearerAuth("access-token")
  getAllItemComplementary(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItemComplementary(filters);
  }
  @Get("/nc-summary")
  @ApiBearerAuth("access-token")
  getAllItemSummaryComplementary(@Query() filters: CommonObjectType) {
    return this.reportsService.getAllItemSummaryComplementary(filters);
  }

  @Get("options")
  getAllOptions() {
    return this.reportsService.getAllOptions();
  }
}
