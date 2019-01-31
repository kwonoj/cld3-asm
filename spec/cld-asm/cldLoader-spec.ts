import { CldAsmModule } from '../../src/cldAsmModule';
import { LanguageIdentifier } from '../../src/cldFactory';
import { cldLoader } from '../../src/cldLoader';
import { LanguageCode } from '../../src/languageCode';
import { wrapCldInterface } from '../../src/wrapCldInterface';

jest.mock('../../src/wrapCldInterface');

const getAsmModule = (): CldAsmModule =>
  (({
    cwrap: jest.fn(),
    getValue: jest.fn(),
    Pointer_stringify: jest.fn(() => LanguageCode.UNKNOWN),
    allocateUTF8: jest.fn(),
    setValue: jest.fn(),
    initializeRuntime: jest.fn(),
    _malloc: jest.fn(),
    _free: jest.fn()
  } as any) as CldAsmModule);

describe('cldLoader', () => {
  let mockCldInterface: {
    getUnknownIdentifier: jest.Mock;
    getMinNumBytesDefault: jest.Mock;
    getMaxNumBytesDefault: jest.Mock;
    getMaxNumBytesInput: jest.Mock;
    sizeLanguageResult: jest.Mock;
    create: jest.Mock;
    findLanguage: jest.Mock;
    findTopNMostFreqLangs: jest.Mock;
    destroy: jest.Mock;
  };

  beforeEach(() => {
    mockCldInterface = {
      getUnknownIdentifier: jest.fn(),
      getMinNumBytesDefault: jest.fn(() => 11),
      getMaxNumBytesDefault: jest.fn(() => 22),
      getMaxNumBytesInput: jest.fn(),
      sizeLanguageResult: jest.fn(),
      create: jest.fn(),
      findLanguage: jest.fn(),
      findTopNMostFreqLangs: jest.fn(),
      destroy: jest.fn()
    };

    (wrapCldInterface as jest.Mock<any>).mockImplementationOnce(() => mockCldInterface);
  });

  it('should able to create with default bytes', () => {
    mockCldInterface.getMinNumBytesDefault.mockReturnValueOnce(11);
    mockCldInterface.getMaxNumBytesDefault.mockReturnValueOnce(22);

    cldLoader(getAsmModule()).create();

    expect(mockCldInterface.getMinNumBytesDefault).toBeCalledTimes(1);
    expect(mockCldInterface.getMaxNumBytesDefault).toBeCalledTimes(1);
  });

  it('should able to create', () => {
    cldLoader(getAsmModule()).create(22, 33);

    expect(mockCldInterface.create).toBeCalledWith(22, 33);
  });

  describe('LanguageIdentifier', () => {
    let identifier: LanguageIdentifier;

    beforeEach(() => {
      identifier = cldLoader(getAsmModule()).create(10, 10);
    });

    it('should able to destroy instance', () => {
      identifier.dispose();

      expect(mockCldInterface.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
