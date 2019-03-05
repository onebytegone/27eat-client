'use strict';

const sass = require('node-sass');

function getEnvironment(grunt) {
   const TYPES = [ 'prd', 'dev' ],
         env = grunt.option('env');

   return TYPES.indexOf(env) === -1 ? 'dev' : env;
}

module.exports = (grunt) => {
   const ENVIRONMENT = getEnvironment(grunt);

   let config;

   config = {
      entryFile: './src/js/index.ts',
      js: {
         gruntFile: 'Gruntfile.js',
         webpackConfig: 'webpack.config.js',
         all: [
            'Gruntfile.js',
            './src/js/**/*.js',
            './tests/**/*.js',
         ],
      },
      markup: {
         base: './src/markup/',
         all: [
            './src/markup/**/*.html',
         ],
         output: './dist/',
      },
      templates: {
         all: [
            './src/js/**/*.html',
         ],
      },
      ts: {
         src: './src/js/**/*.ts',
         all: [
            './src/js/**/*.ts',
            './tests/**/*.ts',
         ],
         configs: {
            standards: 'tsconfig.json',
            esm: 'src/js/tsconfig.esm.json',
         },
      },
      scss: {
         main: './src/scss/main.scss',
         all: './src/scss/**/*.scss',
         output: './dist/css/main.css',
      },
      commands: {
         tsc: './node_modules/.bin/tsc',

         webpack: './node_modules/.bin/webpack',
      },
      out: {
         dist: './dist',
         test: [ './.nyc_output', 'coverage' ],
      },
   };

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      clean: {
         dist: config.out.dist,
         testOutput: config.out.test,
      },

      copy: {
         markup: {
            files: [
               { expand: true, cwd: `${config.markup.base}`, src: 'index.html', dest: `${config.markup.output}` },
            ],
         },
      },

      eslint: {
         target: [ ...config.js.all, ...config.ts.all ],
      },

      exec: {
         options: {
            failOnError: true,
         },
         standards: {
            cmd: `${config.commands.tsc} -p ${config.ts.configs.standards} --pretty`,
         },
         esm: {
            cmd: `${config.commands.tsc} -p ${config.ts.configs.esm} --pretty`,
         },
         webpackUMD: {
            cmd: `${config.commands.webpack} ${config.entryFile} ${ENVIRONMENT === 'prd' ? '--env.production' : ''}`,
         },
      },

      sass: {
         options: {
            implementation: sass,
            sourceMap: (ENVIRONMENT !== 'prd'),
         },

         build: {
            files: { [config.scss.output]: `${config.scss.main}` },
         },
      },

      sasslint: {
         options: {
            configFile: 'node_modules/@silvermine/sass-lint-config/sass-lint.yml',
         },
         target: `${config.scss.all}`,
      },

      watch: {
         ts: {
            files: [ config.ts.src ],
            tasks: [ 'build-umd' ],
         },
         scss: {
            files: [ config.scss.all ],
            tasks: [ 'build-css' ],
         },
         templates: {
            files: [ config.templates.all ],
            tasks: [ 'build-umd' ],
         },
         markup: {
            files: [ config.markup.all ],
            tasks: [ 'copy:markup' ],
         },
         webpackConfig: {
            files: [ config.js.webpackConfig ],
            tasks: [ 'build-umd' ],
         },
         gruntFile: {
            files: [ config.js.gruntFile ],
            options: {
               reload: true,
            },
         },
      },

   });

   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-eslint');
   grunt.loadNpmTasks('grunt-exec');
   grunt.loadNpmTasks('grunt-sass');
   grunt.loadNpmTasks('grunt-sass-lint');

   grunt.registerTask('standards', [ 'eslint', 'exec:standards', 'sasslint' ]);
   grunt.registerTask('default', [ 'standards' ]);

   grunt.registerTask('build-umd', 'exec:webpackUMD');
   grunt.registerTask('build-css', [ 'sass:build' ]);
   grunt.registerTask('build', [ 'build-css', 'build-umd', 'copy:markup' ]);

   grunt.registerTask('develop', [ 'clean', 'build', 'watch' ]);

};
