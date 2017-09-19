//tslint:disable:no-require-imports
import { expect } from 'chai';
import * as path from 'path';
import getLoaderType = require('../../src/getLoader');

//we're mocking emscripten-wasm-loader, can't import values from there.
//create value stub for assertion.
enum mockENVIRONMENT {
  NODE = 'NODE',
  WEB = 'WEB'
}

describe('getLoader', () => {
  const binaryPath = './lib/asm';
  const binaryEndpoint = 'boo';

  let getLoader: typeof getLoaderType.getLoader;
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

    getLoader = require('../../src/getLoader').getLoader;
  });

  it('should create moduleLoader on browser environment override', async () => {
    await getLoader(binaryPath, binaryEndpoint, mockENVIRONMENT.WEB as any);

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);
    //partial match to check dir value only, do not verify loaded runtime
    expect(getModuleLoaderCalls[0][1].dir).to.be.null;

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal(['boo', mockENVIRONMENT.WEB]);
  });

  it('should create module on node environmnet override', async () => {
    await getLoader(binaryPath, binaryEndpoint, mockENVIRONMENT.NODE as any);

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);
    //partial match to check dir value only, do not verify loaded runtime
    expect(getModuleLoaderCalls[0][1].dir).contains(path.join('lib', 'asm'));

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal(['boo', mockENVIRONMENT.NODE]);
  });

  it('should create moduleLoader on browser environment', async () => {
    const { isNode } = require('emscripten-wasm-loader');
    (isNode as jest.Mock<any>).mockReturnValueOnce(false);

    await getLoader(binaryPath, binaryEndpoint);

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);
    //partial match to check dir value only, do not verify loaded runtime
    expect(getModuleLoaderCalls[0][1].dir).to.be.null;

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal(['boo', undefined]);
  });

  it('should create module on node environmnet', async () => {
    const { isNode } = require('emscripten-wasm-loader');
    (isNode as jest.Mock<any>).mockReturnValueOnce(true);

    await getLoader(binaryPath, binaryEndpoint);

    const getModuleLoaderCalls = (require('emscripten-wasm-loader').getModuleLoader as jest.Mock<any>).mock.calls;
    expect(getModuleLoaderCalls).to.have.lengthOf(1);
    //partial match to check dir value only, do not verify loaded runtime
    expect(getModuleLoaderCalls[0][1].dir).contains(path.join('lib', 'asm'));

    const moduleLoaderCalls = mockGetModuleLoader.mock.calls;
    expect(moduleLoaderCalls).to.have.lengthOf(1);
    expect(moduleLoaderCalls[0]).to.deep.equal(['boo', undefined]);
  });
});
//tslint:enable:no-require-imports
