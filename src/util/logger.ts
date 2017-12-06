import { enableLogger as emscriptenEnableLogger } from 'emscripten-wasm-loader';
type logFunctionType = (message: string, ...optionalParams: Array<any>) => void;
/**
 * Default log instance falls back to noop if not specified.
 */
let logInstance: logFunctionType = () => {
  /* noop */
};

const log: logFunctionType = (...args: Array<any>) => (logInstance as any)(...args);

/**
 * Enables logging internal behavior of cld3-asm.
 * @param logger function to log.
 */
const enableLogger = (logger: logFunctionType) => {
  const scopedLogger = (scope: string) => (message: string, ...optionalParams: Array<any>) => {
    logger(`${scope}::${message}`, ...optionalParams);
  };

  logInstance = scopedLogger(`cld3`);
  emscriptenEnableLogger(scopedLogger(`cld3Loader`));
};

export { enableLogger, logFunctionType, log };
