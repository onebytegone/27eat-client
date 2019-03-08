'use strict';

const webpack = require('webpack'),
      path = require('path'),
      pkg = require('./package.json'),
      Dotenv = require('dotenv-webpack');

function getFileNameFromPackageName(packageName) {
   const NAME_PARTS = packageName.split('/');

   return NAME_PARTS[NAME_PARTS.length - 1];
}

module.exports = function(env) {
   const DIST = path.resolve(__dirname, 'dist', 'js');

   env = env || {};

   return {
      mode: env.production ? 'production' : 'development',
      devtool: env.production ? false : 'eval-source-map',
      output: {
         // Use `this` instead of `window` as the global variable that the UMD
         // bundle sets the library to when executed in a node.js context.
         //
         // Ironically, if we don't set this configuration value to `this`, the UMD
         // bundle will throw a `ReferenceError: "window" is undefined` error when
         // executed in node.js.
         globalObject: 'this',
         path: DIST,
         filename: `${getFileNameFromPackageName(pkg.name)}.js`,
      },
      // Let webpack recognize both javascript and typescript files
      resolve: {
         extensions: [ '.js', '.ts' ],
         alias: {
            'vue$': 'vue/dist/vue.esm.js',
         },
      },
      // This enables tree shaking by telling webpack that no files in our project
      // contain side effects, allowing it to remove any code that is not imported.
      // If we do eventually have a file that has side effects, we'd add the paths
      // to those files here.
      optimization: {
         sideEffects: false,
      },
      module: {
         rules: [
            // all files with a `.html` extension will be handled by `html-loader`
            {
               test: /\.html$/,
               loader: 'html-loader',
            },
            // all files with a `.ts` extension will be handled by `ts-loader`
            {
               test: /\.ts$/,
               loader: 'ts-loader',
               options: {
                  configFile: env.tsconfig || path.resolve(__dirname, 'src',  'js', 'tsconfig.esm.json'),
               },
            },
         ],
      },
      plugins: [
         new Dotenv({
            path: path.resolve(__dirname, 'vars', (env.production ? 'prd.env' : 'dev.env')),
         }),
      ],
   };
};
