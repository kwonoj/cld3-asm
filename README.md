[![Build Status](https://travis-ci.org/kwonoj/cld3-asm.svg?branch=master)](https://travis-ci.org/kwonoj/cld3-asm)
[![Build status](https://ci.appveyor.com/api/projects/status/7s0r599r9h6r682g/branch/master?svg=true)](https://ci.appveyor.com/project/kwonoj/cld3-asm/branch/master)
[![codecov](https://codecov.io/gh/kwonoj/cld3-asm/branch/master/graph/badge.svg)](https://codecov.io/gh/kwonoj/cld3-asm)
[![npm](https://img.shields.io/npm/v/cld3-asm.svg)](https://www.npmjs.com/package/cld3-asm)
[![node](https://img.shields.io/badge/node-=>4.0-blue.svg?style=flat)](https://www.npmjs.com/package/cld3-asm)

# cld3-asm

`cld3-asm` is isomorphic javascript binding to google's [compact language detector v3](https://github.com/google/cld3) based on WebAssembly cld3 binary. This module aims to provide thin, lightweight interface to cld3 without requiring native modules.

# Install

```sh
npm install cld3-asm
```

# Usage

## Loading module asynchronously

`cld3-asm` relies on wasm binary (or asm.js where wasm is not supported) of cld3, which need to be initialized first.

```js
import { loadModule } from 'cld3-asm';

const cldFactory = await loadModule();
```

`loadModule` loads wasm binary, initialize it, and returns factory function to create instance of cld3 [language identifier.](https://github.com/kwonoj/cld3-asm/blob/1a86bb67abcebc2cd0e90a83149292eb044e4122/src/cldAsmModule.ts#L70-L97)

```js
loadModule(binaryEndpoint?: string): Promise<CldFactory>
```

It accepts `binaryEndpoint` as optional parameter for mainly browser environment. Unlike node, browser can't access wasm / asm binary directly in filesystem but have to `fetch`. Provide endpoints for paths to `dist/src/lib/**/*.(wasm|mem)` and it'll be fetched runtime. On node, this endpoint can be used to override physical path to binaries.

## Creating language identifier

```js
create(minBytes?: number, maxBytes?: number): LanguageIdentifier
```

`LanguageIdentifier` exposes minimal interfaces to cld3's `NNetLanguageIdentifier`.

- `findLanguage: (text: string): Readonly<LanguageResult>` : Finds the most likely language for the given text.
- `findMostFrequentLanguages(text: string, numLangs: number): Array<Readonly<LanguageResult>>` : Splits the input text into spans based on the script, predicts a language for each span, and returns a vector storing the top num_langs most frequent languages
- `dispose(): void` : Destroy current instance of language identifier. It is important to note created instance will not be destroyed automatically.

There are simple [examples]() for each environments using different apis. In each example directory do `npm install && npm start`.

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