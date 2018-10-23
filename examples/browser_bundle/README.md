## Bundle cld3-asm in frontend javascript

This example aims for particular configuration to include wasm binary itself into frontend javascript bundles.
In normal cases, it is more recommended to use `moduleInitOption.binaryRemoteEndpoint` to point remote location of wasm binary instead.
Check comments in webpack.config.js for required configurations.