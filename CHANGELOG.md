<a name="4.0.0"></a>
# [4.0.0](https://github.com/kwonoj/cld3-asm/compare/v3.1.1...v4.0.0) (2023-12-31)


### Features

* **cld3:** disable nodejs_catch* behavior ([44301f4](https://github.com/kwonoj/cld3-asm/commit/44301f4))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/kwonoj/cld3-asm/compare/v3.1.0...v3.1.1) (2019-07-19)

* dependencies update

<a name="3.1.0"></a>
# [3.1.0](https://github.com/kwonoj/cld3-asm/compare/v3.0.0...v3.1.0) (2019-07-11)


### Features

* **languageresult:** include spaninfo array ([d9f716c](https://github.com/kwonoj/cld3-asm/commit/d9f716c))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/kwonoj/cld3-asm/compare/v2.0.1...v3.0.0) (2019-06-13)


### build

* **tsconfig:** update target ([f619336](https://github.com/kwonoj/cld3-asm/commit/f619336))


### Features

* **loadmodule:** no longer accepts environment ([4a6ecdc](https://github.com/kwonoj/cld3-asm/commit/4a6ecdc))


### BREAKING CHANGES

* **tsconfig:** runtime requires es2018
* **loadmodule:** do not support environment override



<a name="2.0.1"></a>
## [2.0.1](https://github.com/kwonoj/cld3-asm/compare/v2.0.0...v2.0.1) (2019-06-10)


### Features

* **index:** reexport environment ([9eae6e9](https://github.com/kwonoj/cld3-asm/commit/9eae6e9))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/kwonoj/cld3-asm/compare/v2.0.0-beta.6...v2.0.0) (2019-03-01)



<a name="2.0.0-beta.6"></a>
# [2.0.0-beta.6](https://github.com/kwonoj/cld3-asm/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2019-02-14)


### Bug Fixes

* **languagecode:** preserve runtime enum ([e65b7a9](https://github.com/kwonoj/cld3-asm/commit/e65b7a9))


### Features

* **languagecode:** ensure unknown identifier match ([b04f7ef](https://github.com/kwonoj/cld3-asm/commit/b04f7ef))



<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/kwonoj/cld3-asm/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2019-01-31)


### Features

* **loadmodule:** support environment override ([10cffa8](https://github.com/kwonoj/cld3-asm/commit/10cffa8))
* **wrapcldinterface:** cwrap interfaces ([430f850](https://github.com/kwonoj/cld3-asm/commit/430f850))



<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/kwonoj/cld3-asm/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2018-10-31)

- browser field update for esm build

<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/kwonoj/cld3-asm/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2018-10-24)


### Features

* **loadmodule:** expose locatebinary ([606ff1b](https://github.com/kwonoj/cld3-asm/commit/606ff1b))



<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/kwonoj/cld3-asm/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2018-10-23)


### Bug Fixes

* **package:** fix build script ([205465a](https://github.com/kwonoj/cld3-asm/commit/205465a))



<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/kwonoj/cld3-asm/compare/v1.0.1...v2.0.0-beta.1) (2018-10-23)

### Features

* **loadmodule:** deprecate environment ([277b127](https://github.com/kwonoj/cld3-asm/commit/277b127))
* **loadmodule:** support bundling wasm binary ([f0672da](https://github.com/kwonoj/cld3-asm/commit/f0672da))
* **loadmodule:** support moduleinitoption ([0c3c638](https://github.com/kwonoj/cld3-asm/commit/0c3c638))


### BREAKING CHANGES

* **loadmodule:** does not allow env override anymore
* Does not bundle wasm binary with preamble script anymore


<a name="1.0.1"></a>
## [1.0.1](https://github.com/kwonoj/cld3-asm/compare/v1.0.0...v1.0.1) (2018-02-04)


### Bug Fixes

* **package:** update utf8 to version 3.0.0 ([ac47f89](https://github.com/kwonoj/cld3-asm/commit/ac47f89))


### Features

* **cld3:** bump up cld3 binary ([b3e37b6](https://github.com/kwonoj/cld3-asm/commit/b3e37b6))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/kwonoj/cld3-asm/compare/v0.0.11...v1.0.0) (2017-11-30)


### Features

* **cld3:** update cld3 into sigle file binary ([bb8dfa1](https://github.com/kwonoj/cld3-asm/commit/bb8dfa1))
* **loadmodule:** support single file binary load ([d7ab905](https://github.com/kwonoj/cld3-asm/commit/d7ab905))
* **logger:** enablelogger appends scope ([cc98f9e](https://github.com/kwonoj/cld3-asm/commit/cc98f9e))


### BREAKING CHANGES

* **loadmodule:** now runs on native-wasm supported runtime only



<a name="0.0.11"></a>
## [0.0.11](https://github.com/kwonoj/cld3-asm/compare/v0.0.10...v0.0.11) (2017-11-04)



<a name="0.0.10"></a>
## [0.0.10](https://github.com/kwonoj/cld3-asm/compare/v0.0.9...v0.0.10) (2017-10-19)


### Features

* **index:** export constant for und ([65fb78d](https://github.com/kwonoj/cld3-asm/commit/65fb78d))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/kwonoj/cld3-asm/compare/v0.0.8...v0.0.9) (2017-10-10)


### Features

* **cld3:** bump up cld3 ([9c8a697](https://github.com/kwonoj/cld3-asm/commit/9c8a697))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/kwonoj/cld3-asm/compare/v0.0.8...v0.0.9) (2017-10-10)


### Features

* **cld3:** bump up cld3 ([9c8a697](https://github.com/kwonoj/cld3-asm/commit/9c8a697))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/kwonoj/cld3-asm/compare/v0.0.7...v0.0.8) (2017-10-01)


### Features

* **index:** export interfaces ([1718a55](https://github.com/kwonoj/cld3-asm/commit/1718a55))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/kwonoj/cld3-asm/compare/v0.0.6...v0.0.7) (2017-09-22)



<a name="0.0.6"></a>
## [0.0.6](https://github.com/kwonoj/cld3-asm/compare/v0.0.5...v0.0.6) (2017-09-20)


### Features

* **getloader:** refactor getting loader into closure ([e0155a0](https://github.com/kwonoj/cld3-asm/commit/e0155a0))
* **loadmodule:** fall back to asm.js if wasm load fails ([aef1307](https://github.com/kwonoj/cld3-asm/commit/aef1307))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/kwonoj/cld3-asm/compare/v0.0.4...v0.0.5) (2017-09-18)


### Bug Fixes

* **preamble:** support electron without require ([a612f74](https://github.com/kwonoj/cld3-asm/commit/a612f74))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/kwonoj/cld3-asm/compare/v0.0.2...v0.0.4) (2017-09-16)


### Bug Fixes

* **cldasmmodule:** export runtime interfaces ([4ea0ff1](https://github.com/kwonoj/cld3-asm/commit/4ea0ff1))


### Features

* **cld3:** bump up cld3 ([17f5279](https://github.com/kwonoj/cld3-asm/commit/17f5279))
* **cld3:** bump up cld3 ([17cc23d](https://github.com/kwonoj/cld3-asm/commit/17cc23d))
* **loadmodule:** support environment override ([1f5bc51](https://github.com/kwonoj/cld3-asm/commit/1f5bc51))
* **logger:** wire emscripten loader logger ([b5b29e1](https://github.com/kwonoj/cld3-asm/commit/b5b29e1))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/kwonoj/cld3-asm/compare/v0.0.2...v0.0.3) (2017-09-15)


### Bug Fixes

* **cldasmmodule:** export runtime interfaces ([4ea0ff1](https://github.com/kwonoj/cld3-asm/commit/4ea0ff1))


### Features

* **cld3:** bump up cld3 ([17cc23d](https://github.com/kwonoj/cld3-asm/commit/17cc23d))
* **loadmodule:** support environment override ([1f5bc51](https://github.com/kwonoj/cld3-asm/commit/1f5bc51))
* **logger:** wire emscripten loader logger ([b5b29e1](https://github.com/kwonoj/cld3-asm/commit/b5b29e1))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/kwonoj/cld3-asm/compare/v0.0.1...v0.0.2) (2017-09-08)



<a name="0.0.1"></a>
## 0.0.1 (2017-08-27)


### Bug Fixes

* **findmostfrequentlanguages:** update type definition ([ecdf032](https://github.com/kwonoj/cld3-asm/commit/ecdf032))
* **findmostfrequentlanguages:** utf8 encode input ([b7c0b48](https://github.com/kwonoj/cld3-asm/commit/b7c0b48))


### Features

* **cld3:** add initial cld3 binaries ([3825273](https://github.com/kwonoj/cld3-asm/commit/3825273))
* **cld3:** bump up cld3 ([398eb97](https://github.com/kwonoj/cld3-asm/commit/398eb97))
* **cldasmmodule:** export asm module interfaces ([9c2f119](https://github.com/kwonoj/cld3-asm/commit/9c2f119))
* **cldfactory:** export cldfactory interfaces ([bb4e308](https://github.com/kwonoj/cld3-asm/commit/bb4e308))
* **cldloader:** implement cldloader ([c1b061c](https://github.com/kwonoj/cld3-asm/commit/c1b061c))
* **index:** export loadModule ([3435c69](https://github.com/kwonoj/cld3-asm/commit/3435c69))
* **index:** setup index export ([ea05fe5](https://github.com/kwonoj/cld3-asm/commit/ea05fe5))
* **loadmodule:** implement loadmodule ([1ead2ec](https://github.com/kwonoj/cld3-asm/commit/1ead2ec))
* **util:** add utility implementation ([cca4c79](https://github.com/kwonoj/cld3-asm/commit/cca4c79))



