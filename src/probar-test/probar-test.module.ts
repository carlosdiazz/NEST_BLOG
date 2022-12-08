import { Module } from '@nestjs/common';
import { ProbarTestController } from './probar-test.controller';

@Module({
  controllers: [ProbarTestController],
})
export class ProbarTestModule {}
