// Copyright 2015-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  /*
   * Removed to force the simulation to load into the lab screen
   * - Ross Rucho
   *
  var IntroScreen = require( 'PROJECTILE_MOTION/intro/IntroScreen' );
  var DragScreen = require( 'PROJECTILE_MOTION/drag/DragScreen' );
  var VectorsScreen = require( 'PROJECTILE_MOTION/vectors/VectorsScreen' );
  */
  var LabScreen = require( 'PROJECTILE_MOTION/lab/LabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var projectileMotionTitleString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Mike Dubson',
      softwareDevelopment: 'Andrea Lin',
      team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
      qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( projectileMotionTitleString, [
      /*
       * Removed to force the simulation to load into the lab screen
       * - Ross Rucho
       *
      new IntroScreen(),
      new VectorsScreen(),
      new DragScreen(),
      */
      new LabScreen()
    ], simOptions );
    sim.start();
  } );
} );

