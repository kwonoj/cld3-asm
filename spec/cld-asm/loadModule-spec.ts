import { expect } from 'chai';
import { ENVIRONMENT } from 'emscripten-wasm-loader';
import { loadModule } from '../../src/loadModule';

jest.mock('../../src/lib/cld3', () => jest.fn(), { virtual: true });
jest.mock('../../src/cldLoader');
jest.mock('emscripten-wasm-loader', () => ({
  isWasmEnabled: jest.fn(),
  isNode: jest.fn(),
  getModuleLoader: jest.fn(),
  ENVIRONMENT: {
    WEB: 'WEB',
    NODE: 'NODE'
  }
}));

const { getModuleLoader: getModuleLoaderMock } = require('emscripten-wasm-loader'); //tslint:disable-line:no-require-imports no-var-requires

describe('loadModule', () => {
  it('should create moduleLoader on browser environment override', async () => {
    const mockModuleLoader = jest.fn();
    getModuleLoaderMock.mockImplementationOnce((cb: Function) => {
      cb();
      return mockModuleLoader;
    });
    await loadModule(ENVIRONMENT.WEB);

    expect(mockModuleLoader.mock.calls[0]).to.deep.equal([ENVIRONMENT.WEB]);
  });

  it('should create module on node environmnet override', async () => {
    const mockModuleLoader = jest.fn();
    getModuleLoaderMock.mockReturnValueOnce(mockModuleLoader);
    await loadModule(ENVIRONMENT.NODE);

    expect(mockModuleLoader.mock.calls[0]).to.deep.equal([ENVIRONMENT.NODE]);
  });
});
