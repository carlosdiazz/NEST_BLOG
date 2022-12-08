import { Controller, Get } from '@nestjs/common';

@Controller('probar-test')
export class ProbarTestController {
  @Get()
  findAll() {
    return [];
  }
}
