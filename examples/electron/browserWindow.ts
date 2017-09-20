import { enableLogger, loadModule } from '../../src/index';

enableLogger(console.log.bind(console));

const init = async () => {
  try {
    const cldFactory = await loadModule();
    const cld = cldFactory.create(10, 1000);

    //demo purpose only: hook input event then run cld each time input emits value
    (window as any).ta.addEventListener('input', (evt: Event) => {
      if (!!evt.target && !!(evt.target as any).value) {
        const v = (evt.target as any).value;
        //we created cld with 10 char as min length of input. Skipping shorter text
        if (v.length < 10) {
          return;
        }
        const start = performance.now();
        const result = cld.findLanguage(v);
        const time = performance.now() - start;

        (window as any).out.innerText = `findLanguage: ${v} \n took ${time}ms, length ${v.length} \n ${JSON.stringify(
          result
        )}`;
      }
    });
  } catch (e) {
    //tslint:disable-next-line
    console.log(`failed to load cld library`, e);
  }
};

init();
