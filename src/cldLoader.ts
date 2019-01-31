import { ENVIRONMENT } from 'emscripten-wasm-loader';
import { CldAsmModule, LanguageResult } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { LanguageCode } from './languageCode';
import { log } from './util/logger';
import { wrapCldInterface } from './wrapCldInterface';

// size of pointer to calculate pointer position.
const PTR_SIZE = 4;

/**
 * @internal
 * Creates a factory function for mounting files into wasm filesystem
 * and creating language identifier instance.
 *
 * @param {CldAsmModule} asmModule wasm / asm module loaded into memory.
 *
 * @returns {CldFactory} Factory function manages lifecycle of cld3 language identifier.
 */
export const cldLoader = (asmModule: CldAsmModule, _environment?: ENVIRONMENT): CldFactory => {
  const { cwrap, _free, allocateUTF8, _malloc, getValue, Pointer_stringify, setValue } = asmModule;
  const cldInterface = wrapCldInterface(cwrap);

  /**
   * Naive auto-dispose interface to call cld interface with string params.
   *
   */
  const usingParamPtr = <T = void>(...args: Array<string | ((...args: Array<number>) => T)>): T => {
    const params = [...args];
    const fn = params.pop()!;
    const paramsPtr = params.map((param: string) => allocateUTF8(param));
    const ret = (fn as Function)(...paramsPtr);
    paramsPtr.forEach(paramPtr => _free(paramPtr));
    return ret;
  };

  // grab constant values from cld3 library
  const unknownIdentifier = Pointer_stringify(cldInterface.getUnknownIdentifier());
  const minBytesDefault = cldInterface.getMinNumBytesDefault();
  const maxBytesDefault = cldInterface.getMaxNumBytesDefault();
  const maxBytesInput = cldInterface.getMaxNumBytesInput();
  const languageResultStructSize = cldInterface.sizeLanguageResult();

  log(`cldLoader: cld3 wasm initialized with default values`, {
    unknownIdentifier,
    minBytesDefault,
    maxBytesDefault,
    maxBytesInput,
    languageResultStructSize
  });

  /**
   * Wrapper function to read LanguageResult struct from pointer.
   * After interop, pointer will be freed.
   *
   * @param structPtr
   */
  const volatileReadResultStruct = (structPtr: number) => {
    // get value of first field of LanguageResult struct (char*)
    const languageStringPtr = getValue(structPtr + PTR_SIZE * 0, '*');

    // be careful to match order of properties to match pointer to struct field.
    const ret: LanguageResult = {
      language: Pointer_stringify(languageStringPtr) as LanguageCode,
      probability: getValue(structPtr + PTR_SIZE * 1, 'float'),
      is_reliable: !!getValue(structPtr + PTR_SIZE * 2, 'i8'),
      proportion: getValue(structPtr + PTR_SIZE * 3, 'float')
    };

    //free char* for language string
    _free(languageStringPtr);
    //free struct
    _free(structPtr);

    return ret;
  };

  return {
    create: (minBytes: number = minBytesDefault, maxBytes: number = maxBytesDefault) => {
      const cldPtr = cldInterface.create(minBytes, maxBytes);

      return {
        unknownIdentifier,
        findLanguage: (text: string) => {
          // `findLanguage` requires caller must allocate memory for return value.
          const resultPtr = _malloc(languageResultStructSize);
          usingParamPtr(text, textPtr => cldInterface.findLanguage(cldPtr, textPtr, resultPtr));
          return volatileReadResultStruct(resultPtr);
        },
        findMostFrequentLanguages: (text: string, numLangs: number) => {
          // `findMostFrequentLanguages` requires caller must allocate memory for return value.
          const languageListPtr = _malloc(numLangs * PTR_SIZE);

          // For convinience, we'll store allocated pointer to each empty LanguageResult for return value
          const resultStructsPtr: Array<number> = [];

          //allocate memory in js. `findTopNMostFreqLangs` always returns vector with given num_langs, allows predictable memory allocation.
          for (let idx = 0; idx < numLangs; idx++) {
            const resultPtr = _malloc(languageResultStructSize);
            resultStructsPtr.push(resultPtr);
            // fill in array with allocated struct ptr
            setValue(languageListPtr + idx * PTR_SIZE, resultPtr, '*');
          }

          const languageCount = usingParamPtr(text, textPtr =>
            cldInterface.findTopNMostFreqLangs(cldPtr, textPtr, numLangs, languageListPtr)
          );

          // if `numLangs` exceeds number of languages detected rest of array will be filled with default result with unknown language identifier
          const ret = resultStructsPtr
            .map(ptr => volatileReadResultStruct(ptr))
            .filter(x => x.language !== unknownIdentifier);

          // each LanguageResult struct is freed via `volatileReadResultStruct` already. delete allocated memory for array itself.
          _free(languageListPtr);

          return languageCount > 0 ? ret : [];
        },
        dispose: () => cldInterface.destroy(cldPtr)
      };
    }
  };
};
