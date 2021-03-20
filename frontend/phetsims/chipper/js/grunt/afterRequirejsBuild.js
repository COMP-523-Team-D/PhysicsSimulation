// Copyright 2015, University of Colorado Boulder

/**
 * This (asynchronous) grunt task does things after the requirejs:build step.
 * It is for internal use only, not intended to be called directly.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
/* eslint-env node */
'use strict';

// modules
var createDependenciesJSON = require( './createDependenciesJSON' );
var createMipmapsJavaScript = require( './createMipmapsJavaScript' );
var createHTMLFiles = require( './createHTMLFiles' );
var reportUnusedMedia = require( './reportUnusedMedia' );
var reportUnusedStrings = require( './reportUnusedStrings' );
var copySupplementalPhETIOFiles = require( './phet-io/copySupplementalPhETIOFiles' );

/**
 * @param grunt - the grunt instance
 * @param {Object} buildConfig - see getBuildConfig.js
 */
module.exports = function( grunt, buildConfig ) {

  // Tell grunt to wait because this task is asynchronous.
  // Returns a handle to a function that must be called when the task has completed.
  var done = grunt.task.current.async();

  // After all media plugins have completed (which happens in requirejs:build), report which media files in the repository are unused.
  reportUnusedMedia( grunt, buildConfig.requirejsNamespace );

  // After all strings have been loaded, report which of the translatable strings are unused.
  reportUnusedStrings( grunt, buildConfig );

  // Since this is an asynchronous task, each step in the task uses a callback to advance to the next step.
  // The final step in the task calls 'done', to tell grunt that the task has completed.
  createDependenciesJSON( grunt, buildConfig, function( dependenciesJSON ) {
    createMipmapsJavaScript( grunt, buildConfig, function( mipmapsJavaScript ) {
      createHTMLFiles( grunt, buildConfig, dependenciesJSON, mipmapsJavaScript, function() {

        // For phet-io simulations, copy the other phet-io files, including "lib", "wrappers", etc.
        if ( buildConfig.brand === 'phet-io' ) {
          copySupplementalPhETIOFiles( grunt, buildConfig, done );
        }
        else {
          done();
        }
      } );
    } );
  } );
};
