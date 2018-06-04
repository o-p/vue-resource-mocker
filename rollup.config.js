export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-resource-mocker.umd.js',
      name: 'VueResourceMocker',
      format: 'umd',
      exports: 'named',
    }, {
      file: 'dist/vue-resource-mocker.esm.js',
      format: 'es',
    }, {
      file: 'dist/vue-resource-mocker.common.js',
      format: 'cjs',
      exports: 'named',
    }
  ],
}
