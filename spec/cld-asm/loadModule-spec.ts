//tslint:disable:no-require-imports
import { expect } from 'chai';
import * as path from 'path';
import loadModuleType = require('../../src/loadModule');

describe('loadModule', () => {
  let loadModule: typeof loadModuleType.loadModule;

  let asm: jest.Mock<any>;
  let wasm: jest.Mock<any>;

  beforeEach(() => {
    const mockLoader = {
      initializeRuntime: () => Promise.resolve(true)
    };

    jest.mock('../../src/util/isWasmEnabled');
    jest.mock('../../src/util/isNode');

    jest.mock('../../src/lib/asm/cld3', () => jest.fn(() => mockLoader), { virtual: true });
    jest.mock('../../src/lib/wasm/cld3', () => jest.fn(() => mockLoader), { virtual: true });

    jest.mock('../../src/cldLoader');

    loadModule = require('../../src/loadModule').loadModule;

    asm = require('../../src/lib/asm/cld3');
    wasm = require('../../src/lib/wasm/cld3');
  });

  it('should load wasm if wasm supported', async () => {
    const isWasmEnabled: jest.Mock<() => boolean> = require('../../src/util/isWasmEnabled').isWasmEnabled;
    isWasmEnabled.mockReturnValueOnce(true);

    await loadModule();

    expect(asm.mock.calls).to.have.lengthOf(0);
    expect(wasm.mock.calls).to.have.lengthOf(1);
  });

  it('should load asm if wasm is not supported', async () => {
    const isWasmEnabled: jest.Mock<() => boolean> = require('../../src/util/isWasmEnabled').isWasmEnabled;
    isWasmEnabled.mockReturnValueOnce(false);

    await loadModule();

    expect(asm.mock.calls).to.have.lengthOf(1);
    expect(wasm.mock.calls).to.have.lengthOf(0);
  });

  it('should accept binaryEndpoint', async () => {
    await loadModule('endpoint');
    expect(Object.keys(asm.mock.calls[0][0])).to.have.lengthOf(1);
    expect(asm.mock.calls[0][0]['locateFile']).to.be.a('function');
  });

  it('should compose binaryEndpoint for node', async () => {
    const endpoint = 'c:\\endpoint';
    const filename = 'hunspell.wasm';
    const expected = path.join(endpoint, filename);

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(true);
    await loadModule(endpoint);

    const locateFile = asm.mock.calls[0][0]['locateFile'];
    expect(locateFile(filename)).to.equal(expected);
  });

  it('should compose binaryEndpoint for browser', async () => {
    const endpoint = 'http://127.0.0.1/bin';
    const filename = 'hunspell.wasm';
    const expected = `${endpoint}/hunspell.wasm`;

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(false);
    await loadModule(endpoint);

    const locateFile = asm.mock.calls[0][0]['locateFile'];
    expect(locateFile(filename)).to.equal(expected);
  });
});
//tslint:enable:no-require-imports
