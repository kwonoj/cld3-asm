//tslint:disable:no-require-imports
import { expect } from 'chai';
import loadModuleType = require('../../src/loadModule');

//we're mocking emscripten-wasm-loader, can't import values from there.
//create value stub for assertion.
enum mockENVIRONMENT {
  NODE = 'NODE',
  WEB = 'WEB'
}

jest.mock('../../src/lib/cld3', () => jest.fn(), { virtual: true });

describe('loadModule', () => {
  let loadModule: typeof loadModuleType.loadModule;
  let mockGetModuleLoader: jest.Mock<any>;

  beforeEach(() => {
    mockGetModuleLoader = jest.fn(() => jest.fn());
    jest.mock('emscripten-wasm-loader', () => ({
      isWasmEnabled: jest.fn(),
      isNode: jest.fn(),
      getModuleLoader: jest.fn((cb: Function) => {
        cb();
        return mockGetModuleLoader;
      }),
      ENVIRONMENT: mockENVIRONMENT
    }));

    loadModule = require('../../src/loadModule').loadModule;
  });

  it('should create moduleLoader on browser environment override', async () => {
    await loadModule(mockENVIRONMENT.WEB as any);

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal([mockENVIRONMENT.WEB]);
  });

  it('should create module on node environmnet override', async () => {
    await loadModule(mockENVIRONMENT.NODE as any);

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal([mockENVIRONMENT.NODE]);
  });

  it('should create moduleLoader on browser environment', async () => {
    const { isNode } = require('emscripten-wasm-loader');
    (isNode as jest.Mock<any>).mockReturnValueOnce(false);

    await loadModule();

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal([undefined]);
  });

  it('should create module on node environmnet', async () => {
    const { isNode } = require('emscripten-wasm-loader');
    (isNode as jest.Mock<any>).mockReturnValueOnce(true);

    await loadModule();

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal([undefined]);
  });
});
//tslint:enable:no-require-imports
