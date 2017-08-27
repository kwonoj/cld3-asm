import { expect } from 'chai';
import * as index from '../../src/index';

describe('index', () => {
  it('should export correctly', () => {
    const { enableLogger, log, loadModule } = index;

    expect(enableLogger).to.exist;
    expect(log).to.exist;
    expect(loadModule).to.exist;
  });
});
