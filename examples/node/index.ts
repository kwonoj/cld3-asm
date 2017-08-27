//tslint:disable:no-console
import { loadModule } from '../../src';
import { enableLogger } from '../../src/util/logger';
import { runCld } from '../runCld';

enableLogger(console.log.bind(console));

const runNodeCld = async () => {
  const cldFactory = await loadModule();

  runCld(cldFactory);
};

runNodeCld();
