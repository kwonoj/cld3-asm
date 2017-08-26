//tslint:disable:no-require-imports
import { expect } from 'chai';
import isWasmEnabledType = require('../../../src/util/isWasmEnabled');

describe('isWasmEnabled', () => {
  let isWasmEnabled: typeof isWasmEnabledType.isWasmEnabled;
  let root: any;

  beforeEach(() => {
    jest.mock('../../../src/util/root', () => ({ root: {} }));
    isWasmEnabled = require('../../../src/util/isWasmEnabled').isWasmEnabled;
    root = require('../../../src/util/root').root;
  });

  it('should return true if native wasm object found', () => {
    root.WebAssembly = {
      compile: {},
      instantiate: {}
    };

    expect(isWasmEnabled()).to.be.true;
  });

  it('should return false if native wasm object not found', () => {
    root.WebAssembly = {};

    expect(isWasmEnabled()).to.be.false;
  });
});
