// Copyright 2017, University of Colorado Boulder

/**
 * Generates the top-level simName-accessibility-view.html file for simulations (or runnables). Lets one
 * see the accessible content by placing the sim in an iFrame and running an up to date copy of the parallel
 * DOM next to it.
 *
 * @author Jesse Greenberg
 */
/* eslint-env node */
'use strict';

// modules
var ChipperConstants = require( '../common/ChipperConstants' );
var ChipperStringUtils = require( '../common/ChipperStringUtils' );

/**
 * @param {Object} grunt - The grunt runtime object
 * @param {Object} buildConfig - see getBuildConfig.js
 */
module.exports = function( grunt, buildConfig ) {

  var repositoryName = buildConfig.name;
  var html = grunt.file.read( '../chipper/templates/sim-a11y-view.html' ); // the template file

  // Replace placeholders in the template.
  html = ChipperStringUtils.replaceAll( html, '{{PHET_SIM_TITLE}}', buildConfig.name );
  html = ChipperStringUtils.replaceAll( html, '{{PHET_SIM_URL}}', buildConfig.name + '_' + ChipperConstants.FALLBACK_LOCALE + '.html' );

  // Write to the repository's root directory.
  grunt.file.write( repositoryName + '-a11y-view.html', html );
};
