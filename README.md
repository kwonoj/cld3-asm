[![Build Status](https://travis-ci.org/kwonoj/cld3-asm.svg?branch=master)](https://travis-ci.org/kwonoj/cld3-asm)
[![Build status](https://ci.appveyor.com/api/projects/status/vko7m5l7brt5w9ok?svg=true)](https://ci.appveyor.com/project/kwonoj/cld3-asm)
[![codecov](https://codecov.io/gh/kwonoj/cld3-asm/branch/master/graph/badge.svg)](https://codecov.io/gh/kwonoj/cld3-asm)
[![npm](https://img.shields.io/npm/v/cld3-asm.svg)](https://www.npmjs.com/package/cld3-asm)
[![node](https://img.shields.io/badge/node-=>8.0-blue.svg?style=flat)](https://www.npmjs.com/package/cld3-asm)
[![Greenkeeper badge](https://badges.greenkeeper.io/kwonoj/cld3-asm.svg)](https://greenkeeper.io/)

# cld3-asm

`cld3-asm` is isomorphic javascript binding to google's [compact language detector v3](https://github.com/google/cld3) based on WebAssembly cld3 binary. This module aims to provide thin, lightweight interface to cld3 without requiring native modules.

# Install

```sh
npm install cld3-asm
```

# Usage

## Loading module asynchronously

`cld3-asm` relies on wasm binary of cld3, which need to be initialized first.

```js
import { loadModule } from 'cld3-asm';

const cldFactory = await loadModule();
```

`loadModule` loads wasm binary, initialize it, and returns factory function to create instance of cld3 [language identifier.](https://github.com/kwonoj/cld3-asm/blob/1a86bb67abcebc2cd0e90a83149292eb044e4122/src/cldAsmModule.ts#L70-L97)

```js
loadModule(environment?: ENVIRONMENT): Promise<CldFactory>
```

It accepts `environment` as option, allow to override running environment and ignores internal runtime detection. This is mostly for [Electron](https://electron.atom.io/)'s renderer process where node.js and `fetch` are available both, to selectively opt-in which way to use. It is important to note `loadModule` doesn't interop incorrect option value matching, like try to load correct binary when supply endpoint to file path with set env to browser.

## Creating language identifier

```js
create(minBytes?: number, maxBytes?: number): LanguageIdentifier
```

`LanguageIdentifier` exposes minimal interfaces to cld3's `NNetLanguageIdentifier`.

- `findLanguage(text: string): Readonly<LanguageResult>` : Finds the most likely language for the given text.
- `findMostFrequentLanguages(text: string, numLangs: number): Array<Readonly<LanguageResult>>` : Splits the input text into spans based on the script, predicts a language for each span, and returns a vector storing the top num_langs most frequent languages
- `dispose(): void` : Destroy current instance of language identifier. It is important to note created instance will not be destroyed automatically.

There are simple [examples](https://github.com/kwonoj/cld3-asm/tree/master/examples) for each environments. In each example directory do `npm install && npm start`.

# Building / Testing

Few npm scripts are supported for build / test code.

- `build`: Transpiles code to ES5 commonjs to `dist`.
- `test`: Run `cld` / `cld3-asm` test both. Does not require `build` before execute test.
- `test:cld`: Run integration test for actual cld3 wasm binary, using [cld's test case](https://github.com/google/cld3/blob/2afbfc6f8b82cb7a5557c81862509e06f4f23ac4/src/nnet_lang_id_test.cc).
- `test:cld3-asm`: Run unit test against `cld3-asm` interface
- `lint`: Run lint over all codebases
- `lint:staged`: Run lint only for staged changes. This'll be executed automatically with precommit hook.
- `commit`: Commit wizard to write commit message

# License

- cld3: [original license](https://github.com/google/cld3/blob/master/LICENSE)
- cld3-asm: [MIT](https://github.com/kwonoj/cld3-asm/blob/master/LICENSE)