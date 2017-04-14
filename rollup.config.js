import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  external: ['react', 'react-dom'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ],
  dest: 'dist/main.js'
};
