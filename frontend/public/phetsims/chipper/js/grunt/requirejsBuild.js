// Copyright 2016, University of Colorado Boulder

/**
 * Combine and minify all of the code/images/audio using r.js, almond and uglify2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
/* eslint-env node */
'use strict';

var requirejs = require( 'requirejs' );
var assert = require( 'assert' );
var istanbul = require( 'istanbul' );

/**
 * @param {Object} grunt - the grunt instance
 * @param {Object} buildConfig - the buildConfig
 */
module.exports = function( grunt, buildConfig ) {

  // TODO: chipper#101 eek, this is scary! we are importing from the node_modules dir. ideally we should just have uglify-js installed once in sherpa?
  var uglify = require( 'uglify-js' );// eslint-disable-line require-statement-match

  // Validate phet-io brand naming, see https://github.com/phetsims/chipper/issues/504
  if ( buildConfig.brand === 'phet-io' ) {
    assert( buildConfig.version.indexOf( 'phetio' ) >= 0, 'phet-io branded things must have phetio in the string so they will be ' +
                                                          'properly dealt with on build-server' );
  }

  if ( buildConfig.brand === 'phet' ) {
    assert( buildConfig.version.indexOf( 'phetio' ) === -1, 'phet versions cannot be named like phet-io versions' );
  }

  // The name of the repository from which grunt was launched.
  var repositoryName = buildConfig.name;

  // Wait until build complete
  var done = grunt.task.current.async();

  var instrumenter = grunt.option( 'instrument' ) ? new istanbul.Instrumenter() : null;

  var config = {

    // Includes a require.js stub called almond, so that we don't have to include the full require.js runtime
    // inside of builds. This helps reduce file size, and the rest of require.js isn't needed. See
    // https://github.com/phetsims/chipper/issues/277
    // See https://github.com/requirejs/almond for more about specifying name=almond
    name: 'almond',

    // Avoid optimization names that are outside the baseUrl, see http://requirejs.org/docs/optimization.html#pitfalls
    paths: {
      almond: '../../sherpa/lib/almond-0.2.9'
    },

    // JS config file
    mainConfigFile: 'js/' + repositoryName + '-config.js',

    // Add instrumentation if required
    onBuildWrite: function( moduleName, path, contents ) {
      if ( instrumenter &&
           path.indexOf( '.js' ) > 0 &&
           path.indexOf( '..' ) < 0 &&
           moduleName.indexOf( '!' ) < 0 ) {
        var filePath = 'build/instrumentation/' + moduleName + '.js';
        var fileDir = filePath.slice( 0, filePath.lastIndexOf( '/' ) );
        grunt.file.mkdir( fileDir );
        grunt.file.write( filePath, contents );
        grunt.log.debug( 'instrumenting ' + filePath );
        return instrumenter.instrumentSync( contents, filePath );
      }
      else {
        return contents;
      }
    },

    // optimized output file
    out: 'build/' + repositoryName + '.min.js',

    // turn off preservation of comments that have a license in them
    preserveLicenseComments: false,

    // Minification strategy.
    optimize: grunt.option( 'uglify' ) === false ? 'none' : 'uglify2',

    // uglify2 configuration options
    uglify2: {

      mangle: grunt.option( 'mangle' ) !== false,

      // output options documented at https://github.com/mishoo/UglifyJS2#beautifier-options
      output: {
        inline_script: true, // escape </script

        beautify: grunt.option( 'mangle' ) === false
      },

      // compress options documented at https://github.com/mishoo/UglifyJS2#compressor-options
      compress: {

        dead_code: true, // remove unreachable code

        // To define globals, use global_defs inside compress options, see https://github.com/jrburke/r.js/issues/377
        global_defs: {

          // global assertions (PhET-specific)
          assert: false,
          assertSlow: false,

          // scenery logging (PhET-specific)
          sceneryLog: false,
          sceneryAccessibilityLog: false,

          // for tracking object allocations, see phet-core/js/phetAllocation.js (PhET-specific)
          phetAllocation: false
        }
      }
    },

    // modules to stub out in the optimized file
    stubModules: [ 'string', 'audio', 'image', 'mipmap' ]
  };

  // If we are compiling the JS only, we'll want to add start/end wrapping JS with an IIFE, that checks for dependencies and sets up globals.
  // This needs to load synchronously, see https://github.com/phetsims/scenery/issues/593.
  if ( buildConfig.isJSOnly ) {
    // Checks if lodash exists
    var testLodash = '  if ( !window.hasOwnProperty( \'_\' ) ) {\n' +
                     '    throw new Error( \'Underscore/Lodash not found: _\' );\n' +
                     '  }\n';
    // Checks if jQuery exists
    var testJQuery = '  if ( !window.hasOwnProperty( \'$\' ) ) {\n' +
                     '    throw new Error( \'jQuery not found: $\' );\n' +
                     '  }\n';
    var includedPreloads = [
      '../assert/js/assert.js'
    ];
    if ( buildConfig.name === 'scenery' ) {
      includedPreloads.push( '../sherpa/lib/himalaya-0.2.7.js' );
    }

    var preloadJS = includedPreloads.map( function( file ) {
      if ( grunt.option( 'uglify' ) === false ) {
        return global.phet.chipper.fs.readFileSync( file, 'utf8' );
      }
      else {
        return uglify.minify( [ file ], {
          mangle: grunt.option( 'mangle' ) !== false,
          output: {
            inline_script: true, // escape </script
            beautify: grunt.option( 'mangle' ) === false
          },
          compress: {
            global_defs: {}
          }
        } ).code;
      }
    } ).join( '\n' );

    config.wrap = {
      start: '(function() {\n' +
             ( buildConfig.requiresLodash ? testLodash : '' ) +
             ( buildConfig.requiresJQuery ? testJQuery : '' ) +
             preloadJS,
      end: Object.keys( buildConfig.assignGlobals ).sort().map( function( global ) {
        // For each key=>value in buildConfig.assignGlobals, we want to set window.key = require( 'value' ), to initialize our globals
        return '  window.' + global + ' = require( \'' + buildConfig.assignGlobals[ global ] + '\' );\n';
      } ).join( '' ) +
           // Allow repositories to insert extra JS at the end (like Scenery polyfills)
           ( buildConfig.finalizeJS ? buildConfig.finalizeJS : '' ) + '\n' +
           '}());'
    };
  }
  // Otherwise, asynchronous loading is fine, so we'll set up insertRequire/wrap.
  else {
    // Start the main launch
    config.insertRequire = [ repositoryName + '-main' ];

    // use the default wrapping strategy to wrap the module code, so that define/require are not globals
    config.wrap = true;
  }

  requirejs.optimize( config, done, function( err ) {

    //optimization err callback
    grunt.log.writeln( 'requirejs failed' );
    grunt.log.writeln( err );
    done();
  } );
};
