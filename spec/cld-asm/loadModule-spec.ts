//tslint:disable:no-require-imports
import { expect } from 'chai';
import * as path from 'path';
import { ENVIRONMENT } from '../../src/environment';
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

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(true);

    await loadModule();

    expect(asm.mock.calls).to.have.lengthOf(0);
    expect(wasm.mock.calls).to.have.lengthOf(1);
  });

  it('should load asm if wasm is not supported', async () => {
    const isWasmEnabled: jest.Mock<() => boolean> = require('../../src/util/isWasmEnabled').isWasmEnabled;
    isWasmEnabled.mockReturnValueOnce(false);

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(true);

    await loadModule();

    expect(asm.mock.calls).to.have.lengthOf(1);
    expect(wasm.mock.calls).to.have.lengthOf(0);
  });

  it('should accept binaryEndpoint', async () => {
    await loadModule('endpoint');
    expect(Object.keys(asm.mock.calls[0][0])).to.have.lengthOf(2);
    expect(asm.mock.calls[0][0]['locateFile']).to.be.a('function');
  });

  it('should throw if binaryEndpoint not available on browser', async () => {
    let thrown = false;
    try {
      await loadModule();
    } catch (e) {
      thrown = true;
      expect(e).to.be.a('error');
    }

    expect(thrown).to.be.true;
  });

  it('should throw if binaryEndpoint not available on browser override', async () => {
    let thrown = false;
    try {
      await loadModule(null as any, ENVIRONMENT.BROWSER);
    } catch (e) {
      thrown = true;
      expect(e).to.be.a('error');
    }

    expect(thrown).to.be.true;
  });

  it('should compose binaryEndpoint for node', async () => {
    const endpoint = 'c:\\endpoint';
    const filename = 'hunspell.wasm';
    const expected = path.join(endpoint, filename);

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(true);
    await loadModule(endpoint);

    const mockCalls = asm.mock.calls[0][0];
    const locateFile = mockCalls['locateFile'];
    const environment = mockCalls['ENVIRONMENT'];

    expect(locateFile(filename)).to.equal(expected);
    expect(environment).to.equal(ENVIRONMENT.NODE);
  });

  it('should compose binaryEndpoint for browser', async () => {
    const endpoint = 'http://127.0.0.1/bin';
    const filename = 'hunspell.wasm';
    const expected = `${endpoint}/hunspell.wasm`;

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(false);
    await loadModule(endpoint);

    const mockCalls = asm.mock.calls[0][0];
    const locateFile = mockCalls['locateFile'];
    const environment = mockCalls['ENVIRONMENT'];

    expect(locateFile(filename)).to.equal(expected);
    expect(environment).to.equal(ENVIRONMENT.BROWSER);
  });

  it('should accept custom environment', async () => {
    const endpoint = 'c:\\endpoint';
    const filename = 'hunspell.wasm';
    const expected = path.join(endpoint, filename);

    const isNode: jest.Mock<() => boolean> = require('../../src/util/isNode').isNode;
    isNode.mockReturnValueOnce(false);
    await loadModule(endpoint, ENVIRONMENT.NODE);

    const mockCalls = asm.mock.calls[0][0];
    const locateFile = mockCalls['locateFile'];
    const environment = mockCalls['ENVIRONMENT'];

    expect(isNode.mock.calls).to.have.lengthOf(0);
    expect(locateFile(filename)).to.equal(expected);
    expect(environment).to.equal(ENVIRONMENT.NODE);
  });
});
//tslint:enable:no-require-imports
