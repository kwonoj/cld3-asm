//tslint:disable:no-require-imports
import { expect } from 'chai';
import * as path from 'path';

describe('loadModule', () => {
  beforeEach(() => {
    jest.mock('../../src/cldLoader', () => ({ cldLoader: jest.fn() }));
    jest.mock('emscripten-wasm-loader', () => ({
      isWasmEnabled: jest.fn(),
      isNode: jest.fn(),
      getModuleLoader: jest.fn()
    }));
  });

  it('should set binary when wasm supported on node', () => {
    const { isWasmEnabled, getModuleLoader, isNode } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(true);
    (isNode as jest.Mock<any>).mockReturnValueOnce(true);

    require('../../src/loadModule');
    expect((getModuleLoader as jest.Mock<any>).mock.calls[0][1].dir).to.have.string(path.join('lib', 'wasm'));
  });

  it('should set binary when wasm not supported on node', () => {
    const { isWasmEnabled, getModuleLoader, isNode } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(false);
    (isNode as jest.Mock<any>).mockReturnValueOnce(true);

    require('../../src/loadModule');
    expect((getModuleLoader as jest.Mock<any>).mock.calls[0][1].dir).to.have.string(path.join('lib', 'asm'));
  });

  it('should empty binary path on browser', () => {
    const { isWasmEnabled, getModuleLoader, isNode } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(true);
    (isNode as jest.Mock<any>).mockReturnValueOnce(false);

    require('../../src/loadModule');
    expect((getModuleLoader as jest.Mock<any>).mock.calls[0][1].dir).to.be.null;
  });

  it('should construct loadModule', () => {
    const { isWasmEnabled, getModuleLoader, isNode } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(false);
    (isNode as jest.Mock<any>).mockReturnValueOnce(true);
    (getModuleLoader as jest.Mock<any>).mockImplementationOnce(cb => cb());

    require('../../src/loadModule');
    expect((getModuleLoader as jest.Mock<any>).mock.calls).to.have.lengthOf(1);
  });
});
//tslint:enable:no-require-imports
