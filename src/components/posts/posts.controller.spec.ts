import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('PostsController', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();

    await app.init();
  });
});
