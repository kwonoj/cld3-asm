import { encode } from 'utf8';
import { CldAsmModule, ResultVector, UnknownLanguage } from './cldAsmModule';
import { CldFactory } from './cldFactory';

const munge_vector = (vector: ResultVector) => {
  const size = vector.size();
  const ret = [];
  for (let idx = 0; idx < size; idx++) {
    ret.push(vector.get(idx));
  }
  return ret;
};

/**
 * @internal
 * Creates a factory function for mounting files into wasm filesystem
 * and creating language identifier instance.
 *
 * @param {CldAsmModule} asmModule wasm / asm module loaded into memory.
 *
 * @returns {CldFactory} Factory function manages lifecycle of cld3 language identifier.
 */
export const cldLoader = (asmModule: CldAsmModule): CldFactory => ({
  create: (
    minBytes: number = asmModule.NNetLanguageIdentifier.kMinNumBytesToConsider,
    maxBytes: number = asmModule.NNetLanguageIdentifier.kMaxNumBytesToConsider
  ) => {
    const identifier = new asmModule.NNetLanguageIdentifier(minBytes, maxBytes);
    return {
      findLanguage: (text: string) => identifier.FindLanguage(encode(text)),
      findMostFrequentLanguages: (text: string, numLangs: number) => {
        const resultVector = identifier.FindTopNMostFreqLangs(encode(text), numLangs);
        const resultArray = munge_vector(resultVector);
        return resultArray.filter(x => !!x && !!x.language && x.language !== UnknownLanguage);
      },
      dispose: () => identifier.delete()
    };
  }
});
