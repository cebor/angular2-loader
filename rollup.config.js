import buble from 'rollup-plugin-buble';

var external = Object.keys(require('./package.json').dependencies).concat(['fs', 'path']);

export default {
  entry: 'src/index.js',
  plugins: [ buble() ],
  external: external,
  targets: [
    { dest: 'dist/angular2-loader.js', format: 'cjs' },
    { dest: 'dist/angular2-loader.esm.js', format: 'es' }
  ]
};
