import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateCmDto } from './dto/create-cm.dto';
import { UpdateCmDto } from './dto/update-cm.dto';
const qs = require('qs');

@Controller({ path: 'cms', version: '1' })
export class CmsController {
  constructor(private readonly cmsService: CmsService) { }
  @Get('*')
  public async passthruGet(
    @Request() req,
    @Param() routeObject: any,
    @Query() params: string,
  ) {
    const route = routeObject[0] ?? '';
    const stringifiedParams = qs.stringify(params);
    const url = `/${route}?${stringifiedParams}`;
    const response = await this.cmsService.passthruGet(url);
    return response?.data;
  }

  @Post()
  create(@Body() createCmDto: CreateCmDto) {
    return this.cmsService.create(createCmDto);
  }

  @Get()
  findAll() {
    return this.cmsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCmDto: UpdateCmDto) {
    return this.cmsService.update(+id, updateCmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cmsService.remove(+id);
  }
}
