//tslint:disable:no-require-imports
import { expect } from 'chai';
import loadModuleType = require('../../src/loadModule');

//we're mocking emscripten-wasm-loader, can't import values from there.
//create value stub for assertion.
enum mockENVIRONMENT {
  NODE = 'NODE',
  WEB = 'WEB'
}

describe('loadModule', () => {
  let loadModule: typeof loadModuleType.loadModule;

  beforeEach(() => {
    jest.mock('../../src/getLoader', () => ({ getLoader: jest.fn() }));

    jest.mock('emscripten-wasm-loader', () => ({
      isWasmEnabled: jest.fn(),
      isNode: jest.fn(),
      ENVIRONMENT: mockENVIRONMENT
    }));

    loadModule = require('../../src/loadModule').loadModule;
  });

  it('should return module from wasm', async () => {
    const { isWasmEnabled } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(true);

    await loadModule();
    const getLoader = require('../../src/getLoader').getLoader as jest.Mock<any>;
    expect(getLoader.mock.calls).to.have.lengthOf(1);
    expect(getLoader.mock.calls[0]).to.deep.equal(['./lib/wasm', undefined, undefined]);
  });

  it('should return module from asm', async () => {
    const { isWasmEnabled } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(false);

    await loadModule();
    const getLoader = require('../../src/getLoader').getLoader as jest.Mock<any>;
    expect(getLoader.mock.calls).to.have.lengthOf(1);
    expect(getLoader.mock.calls[0]).to.deep.equal(['./lib/asm', undefined, undefined]);
  });

  it('should fallback wasm to asm', async () => {
    const { isWasmEnabled } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValue(true);
    const getLoader = require('../../src/getLoader').getLoader as jest.Mock<any>;

    getLoader.mockImplementationOnce(() => {
      throw new Error();
    });

    await loadModule();

    expect(getLoader.mock.calls).to.have.lengthOf(2);
    expect(getLoader.mock.calls[0]).to.deep.equal(['./lib/wasm', undefined, undefined]);
    expect(getLoader.mock.calls[1]).to.deep.equal(['./lib/asm', undefined, undefined]);
  });

  it('should throw fallback asm fail to load', async () => {
    const { isWasmEnabled } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValue(true);
    const getLoader = require('../../src/getLoader').getLoader as jest.Mock<any>;

    getLoader.mockImplementation(() => {
      throw new Error();
    });

    let thrown = false;
    try {
      await loadModule();
    } catch (e) {
      expect(e).to.be.an('Error');
      thrown = true;
    }

    expect(thrown).to.be.true;
    expect(getLoader.mock.calls).to.have.lengthOf(2);
    expect(getLoader.mock.calls[0]).to.deep.equal(['./lib/wasm', undefined, undefined]);
    expect(getLoader.mock.calls[1]).to.deep.equal(['./lib/asm', undefined, undefined]);
  });

  it('should throw if asm fails for first attempt', async () => {
    const { isWasmEnabled } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValue(false);
    const getLoader = require('../../src/getLoader').getLoader as jest.Mock<any>;

    getLoader.mockImplementationOnce(() => {
      throw new Error();
    });

    let thrown = false;
    try {
      await loadModule();
    } catch (e) {
      expect(e).to.be.an('Error');
      thrown = true;
    }

    expect(thrown).to.be.true;
    expect(getLoader.mock.calls).to.have.lengthOf(1);
    expect(getLoader.mock.calls[0]).to.deep.equal(['./lib/asm', undefined, undefined]);
  });

  it('should accept endpoint with environment', async () => {
    const endpoint = 'boo';
    const env = mockENVIRONMENT.NODE;

    const { isWasmEnabled } = require('emscripten-wasm-loader');
    (isWasmEnabled as jest.Mock<any>).mockReturnValueOnce(true);

    await loadModule(endpoint, env as any);
    const getLoader = require('../../src/getLoader').getLoader as jest.Mock<any>;
    expect(getLoader.mock.calls).to.have.lengthOf(1);
    expect(getLoader.mock.calls[0]).to.deep.equal(['./lib/wasm', endpoint, env]);
  });
});
//tslint:enable:no-require-imports
