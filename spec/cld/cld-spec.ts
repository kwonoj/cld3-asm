import { expect } from 'chai';
import * as _ from 'lodash';
import * as utf8 from 'utf8';
import { LanguageIdentifier } from '../../src/cldFactory';
import { loadModule } from '../../src/index';

describe('cld', () => {
  let identifier: LanguageIdentifier;

  //load module one time before test begins
  beforeAll(async done => {
    const cldFactory = await loadModule();
    identifier = cldFactory.create(0, 1000);
    done();
  });

  afterAll(() => identifier.dispose());

  describe('findLanguage', () => {
    //tslint:disable-next-line:no-require-imports
    const fixture: Array<{ expected: string; source: string }> = require('../__fixtures__/nnet_lang_id_test_data.json');
    // https://github.com/google/cld3/issues/6
    const excluded: Array<string> = ['bs', 'id'];

    fixture.filter(({ expected }) => !_.includes(excluded, expected)).forEach(({ expected, source }) => {
      it(`should detect ${expected}`, () => {
        const result = identifier.findLanguage(source);

        expect(result.language).to.equal(expected);
      });
    });
  });

  describe('findMostFrequentLanguages', () => {
    it('should detect multiple languages with proportions', () => {
      // Text containing snippets in English and Bulgarian.
      const text = 'This piece of text is in English. Този текст е на Български.';

      // Expected language spans in the input text, corresponding respectively to
      // Bulgarian and English.
      // cld3-asm does utf8 encode internally, fixture setup encodes string as well.
      const expected_bg_span = utf8.encode(' Този текст е на Български ');
      const expected_en_span = utf8.encode(' This piece of text is in English ');

      const expected_byte_sum = expected_bg_span.length + expected_en_span.length;
      const epsilon = 0.00001;

      // Number of languages to query for and the expected byte proportions.
      const num_queried_langs = 3;
      const expected_lang_proportions = [
        { expected: 'bg', span: expected_bg_span.length / expected_byte_sum },
        { expected: 'en', span: expected_en_span.length / expected_byte_sum }
      ];

      const results = identifier.findMostFrequentLanguages(text, num_queried_langs);

      expect(results).to.have.lengthOf(expected_lang_proportions.length);

      // Iterate over the results and check that the correct proportions are
      // returned for the expected languages.
      for (let idx = 0; idx < results.length; idx++) {
        expect(results[idx].language).to.equal(expected_lang_proportions[idx].expected);
        const propotion = Math.abs(results[idx].proportion - expected_lang_proportions[idx].span);
        expect(propotion).to.lessThan(epsilon);
      }
    });
  });
});
