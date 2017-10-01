import { LanguageResult } from './cldAsmModule';

interface LanguageIdentifier {
  /**
   * Finds the most likely language for the given text, along with additional
   * information (e.g., probability). The prediction is based on the first N
   * bytes where N is the minumum between the number of interchange valid UTF8
   * bytes and max_num_bytes_.
   *
   * @param {string} text input text.
   * @return {Readonly<LanguageResult>} Detected language result.
   * If text is less than minBytes specified when create identifier,
   * returned language will be {UnknownLanuage} (`und`) always.
   */
  findLanguage: (text: string) => Readonly<LanguageResult>;

  /**
   * Splits the input text (up to the first byte, if any, that is not
   * interchange valid UTF8) into spans based on the script, predicts a language
   * for each span, and returns a vector storing the top num_langs most frequent
   * languages along with additional information (e.g., proportions). The number
   * of bytes considered for each span is the minimum between the size of the
   * span and max_num_bytes_. If more languages are requested than what is
   * available in the input, then for those cases {UnknownLanuage} (`und`) is returned. Also, if
   * the size of the span is less than min_num_bytes_ long, then the span is
   * skipped.
   *
   * @param {string} text Input text. If text is larger than maximum input bytes (10000 by default),
   * only the part of maximum input bytes are processed.
   * @param {number} numLangs Number of most frequent language would like to detect.
   * @return {Array<Readonly<LanguageResult>>} Array of detected language result.
   * If detected languages are less than {numLangs} specified, array will include only detected langauges.
   */
  findMostFrequentLanguages: (text: string, numLangs: number) => Array<Readonly<LanguageResult>>;

  /**
   * Destroy current instance of language identifier.
   */
  dispose: () => void;
}

interface CldFactory {
  /**
   * Creates new instance of language identifier.
   * @param {number} minBytes Minimum bytes required to make prediction. 140 by default.
   * @param {number} maxBytes Maximum bytes to make prediction. 700 by default.
   */
  create(minBytes?: number, maxBytes?: number): LanguageIdentifier;
}

export { LanguageIdentifier, CldFactory };
