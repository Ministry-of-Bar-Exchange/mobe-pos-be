import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { OrderItemService } from "./orderItem.service";
import { OrderItem } from "@prisma/client";

@Controller("order-item")
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(@Body() createOrderItemDto: OrderItem) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderItemService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTableDto: Partial<OrderItem>) {
    return this.orderItemService.update(id, updateTableDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderItemService.remove(id);
  }
}
