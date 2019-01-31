import { cwrapSignature } from 'emscripten-wasm-loader';

/**
 * @internal
 *
 * Wrap cld3 exported interfaces via cwrap for resuable mannter.
 */
export const wrapCldInterface = (cwrap: cwrapSignature) => ({
  /**
   * get size of struct for interop.
   *
   * int get_SizeLanguageResult()
   */
  sizeLanguageResult: cwrap<() => number>('get_SizeLanguageResult', 'number'),

  /**
   * Return unknown language identifier
   *
   * const char* get_UnknownIdentifier()
   */
  getUnknownIdentifier: cwrap<() => number>('get_UnknownIdentifier', 'number'),

  /**
   * Min number of bytes needed to make a prediction if the default constructoris called.
   *
   * int get_MinNumBytesDefault()
   */
  getMinNumBytesDefault: cwrap<() => number>('get_MinNumBytesDefault', 'number'),

  /**
   * Max number of bytes to consider to make a prediction if the default constructor is called.
   *
   * int get_MaxNumBytesDefault()
   */
  getMaxNumBytesDefault: cwrap<() => number>('get_MaxNumBytesDefault', 'number'),

  /**
   * Max number of input bytes to process.
   *
   * int get_MaxNumBytesInput()
   */
  getMaxNumBytesInput: cwrap<() => number>('get_MaxNumBytesInput', 'number'),

  /**
   * CldHandle* Cld_create(int min_num_bytes, int max_num_bytes)
   */
  create: cwrap<(minBytes: number, maxBytes: number) => number>('Cld_create', 'number', ['number', 'number']),

  /**
   * void Cld_destroy(CldHandle* pCld)
   */
  destroy: cwrap<(cldHandle: number) => void>('Cld_destroy', null, ['number']),

  /**
   * void Cld_findLanguage(CldHandle* pCld, const char* text, LanguageResult* out_result)
   */
  findLanguage: cwrap<(cldHandle: number, text: number, outResult: number) => void>('Cld_findLanguage', null, [
    'number',
    'number',
    'number'
  ]),

  /**
   * int Cld_findTopNMostFreqLangs(CldHandle* pCld, const char* text, int num_langs, LanguageResult** out_results)
   */
  findTopNMostFreqLangs: cwrap<(cldHandle: number, text: number, numLangs: number, outResults: number) => number>(
    'Cld_findTopNMostFreqLangs',
    'number',
    ['number', 'number', 'number', 'number']
  )
});
