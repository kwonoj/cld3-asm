import { expect } from 'chai';
import * as _ from 'lodash';
import { LanguageIdentifier } from '../../src/cldFactory';
import { loadModule } from '../../src/index';

// https://github.com/google/cld3/issues/6
const excluded: Array<string> = ['bs', 'id'];

describe('findLanguage', () => {
  //tslint:disable-next-line:no-require-imports
  const fixture: Array<{ expected: string; source: string }> = require('../__fixtures__/nnet_lang_id_test_data.json');
  let identifier: LanguageIdentifier;

  //load module one time before test begins
  beforeAll(async done => {
    const cldFactory = await loadModule();
    identifier = cldFactory.create(0, 1000);
    done();
  });

  afterAll(() => identifier.dispose());

  fixture.filter(({ expected }) => !_.includes(excluded, expected)).forEach(({ expected, source }) => {
    it(`should detect ${expected}`, () => {
      const result = identifier.findLanguage(source);

      expect(result.language).to.equal(expected);
    });
  });
});
