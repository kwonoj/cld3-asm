import { expect } from 'chai';
import { CldAsmModule } from '../../src/cldAsmModule';
import { LanguageIdentifier } from '../../src/cldFactory';
import { cldLoader } from '../../src/cldLoader';
import { LanguageCode } from '../../src/languageCode';

describe('cldLoader', () => {
  let asmModule: CldAsmModule;
  beforeEach(() => (asmModule = {} as any));

  it('should able to create with default bytes', () => {
    const called: Array<number> = [];

    (asmModule as any).NNetLanguageIdentifier = (() => {
      const ctor = (...args: Array<any>) => called.push(...args);

      (ctor as any).kMinNumBytesToConsider = 11;
      (ctor as any).kMaxNumBytesToConsider = 22;

      return ctor;
    })();

    cldLoader(asmModule).create();

    expect(called).to.deep.equal([11, 22]);
  });

  it('should able to create', () => {
    const called: Array<number> = [];

    (asmModule as any).NNetLanguageIdentifier = (() => {
      const ctor = (...args: Array<any>) => called.push(...args);

      (ctor as any).kMinNumBytesToConsider = 11;
      (ctor as any).kMaxNumBytesToConsider = 22;

      return ctor;
    })();

    cldLoader(asmModule).create(22, 33);

    expect(called).to.deep.equal([22, 33]);
  });

  describe('LanguageIdentifier', () => {
    let identifier: LanguageIdentifier;
    let mockIdentifier: {
      FindTopNMostFreqLangs: jest.Mock<any>;
      FindLanguage: jest.Mock<any>;
      delete: jest.Mock<any>;
    };

    beforeEach(() => {
      mockIdentifier = {
        FindTopNMostFreqLangs: jest.fn(),
        FindLanguage: jest.fn(),
        delete: jest.fn()
      };

      (asmModule as any).NNetLanguageIdentifier = (() => (..._args: Array<any>) => mockIdentifier)();
      identifier = cldLoader(asmModule).create(10, 10);
    });

    it('should find language', () => {
      const text = 'meh';

      const dummyReturn = { text };
      mockIdentifier.FindLanguage.mockReturnValueOnce(dummyReturn);
      const ret = identifier.findLanguage(text);

      //we do not verify actual wasm binary behavior, only checks input - output logic.
      //actual integration test are placed under cld-spec.
      expect(ret).to.deep.equal(dummyReturn);

      expect(mockIdentifier.FindLanguage.mock.calls).to.have.lengthOf(1);
      expect(mockIdentifier.FindLanguage.mock.calls[0]).to.deep.equal([text]);
    });

    it('should find most frequent languages', () => {
      const text = 'meh';

      const dummyReturnValue = [{ language: text }];
      const dummyReturn = {
        size: () => 2,
        get: (idx: number) => dummyReturnValue[idx]
      };

      mockIdentifier.FindTopNMostFreqLangs.mockReturnValueOnce(dummyReturn);
      const ret = identifier.findMostFrequentLanguages(text, 3);

      //we do not verify actual wasm binary behavior, only checks input - output logic.
      //actual integration test are placed under cld-spec.
      expect(ret).to.deep.equal(dummyReturnValue);

      expect(mockIdentifier.FindTopNMostFreqLangs.mock.calls).to.have.lengthOf(1);
      expect(mockIdentifier.FindTopNMostFreqLangs.mock.calls[0]).to.deep.equal([text, 3]);
    });

    it('should return only found most frequent languages, filter unknown language', () => {
      const text = 'meh';

      const dummyReturnValue = [{ language: text }, { language: LanguageCode.UNKNOWN }];
      const dummyReturn = {
        size: () => 2,
        get: (idx: number) => dummyReturnValue[idx]
      };

      mockIdentifier.FindTopNMostFreqLangs.mockReturnValueOnce(dummyReturn);
      const ret = identifier.findMostFrequentLanguages(text, 3);

      //we do not verify actual wasm binary behavior, only checks input - output logic.
      //actual integration test are placed under cld-spec.
      expect(ret).to.deep.equal([{ language: text }]);

      expect(mockIdentifier.FindTopNMostFreqLangs.mock.calls).to.have.lengthOf(1);
      expect(mockIdentifier.FindTopNMostFreqLangs.mock.calls[0]).to.deep.equal([text, 3]);
    });

    it('should able to destroy instance', () => {
      identifier.dispose();

      expect(mockIdentifier.delete.mock.calls).to.have.lengthOf(1);
    });
  });
});
