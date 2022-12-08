import { Test, TestingModule } from '@nestjs/testing';
import { ProbarTestController } from './probar-test.controller';

describe('ProbarTestController', () => {
  let controller: ProbarTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProbarTestController],
    }).compile();

    controller = module.get<ProbarTestController>(ProbarTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Rutas', () => {
    it('Probando el metodo findAll', () => {
      expect(controller.findAll()).toEqual([]);
    });
  });
});
