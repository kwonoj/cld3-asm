import { enableLogger, loadModule } from '../../src/index';

enableLogger(console.log.bind(console));

//Initialize cld, then attach into global
const init = async () => {
  try {
    const cldFactory = await loadModule();
    (window as any).cld = cldFactory.create(10, 1000);
  } catch (e) {
    //tslint:disable-next-line
    console.log(`failed to load cld library`, e);
  }
};

init();

//demo purpose only: hook loaded page's input event then run cld each time input emits value
const postDOMSetup = () => {
  if (!window || !window.location || !window.document || !window.document.body) {
    setTimeout(postDOMSetup, 250);
    return;
  }

  document.body.addEventListener('input', (evt: Event) => {
    if (!!evt.target && !!(evt.target as any).value) {
      const v = (evt.target as any).value;
      //we created cld with 10 char as min length of input. Skipping shorter text
      if (v.length < 10) {
        return;
      }
      const start = performance.now();
      const result = (window as any).cld.findLanguage(v);
      const time = performance.now() - start;
      //tslint:disable-next-line
      console.log(`findLanguage: ${v} took ${time}ms, length ${v.length}`, result);
    }
  });
};

setTimeout(postDOMSetup, 250);
