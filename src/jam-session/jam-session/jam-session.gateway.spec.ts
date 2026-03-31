import { Test, TestingModule } from '@nestjs/testing';
import { JamSessionGateway } from './jam-session.gateway';

describe('JamSessionGateway', () => {
  let gateway: JamSessionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JamSessionGateway],
    }).compile();

    gateway = module.get<JamSessionGateway>(JamSessionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
