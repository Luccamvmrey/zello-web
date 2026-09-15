import { Module } from '@nestjs/common';
import { SplitRulesController } from './split-rules.controller.js';
import { SplitRulesService } from './split-rules.service.js';

@Module({
  controllers: [SplitRulesController],
  providers: [SplitRulesService],
})
export class SplitRulesModule {}
