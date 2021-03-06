// Copyright 2013-2015, University of Colorado Boulder

/**
 * Configuration file for development and production deployments.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

require.config( {
  // depends on all of Kite, Dot, Axon and phet-core
  deps: [ 'kite-main' ],

  paths: {

    // plugins
    image: '../../chipper/js/requirejs-plugins/image',
    ifphetio: '../../chipper/js/requirejs-plugins/ifphetio',

    // third-party libs
    text: '../../sherpa/lib/text-2.0.12',
    KITE: '../../kite/js',
    DOT: '../../dot/js',
    PHET_CORE: '../../phet-core/js',
    AXON: '../../axon/js',

    TANDEM: '../../tandem/js',
    REPOSITORY: '..'
  },

  // optional cache buster to make browser refresh load all included scripts, can be disabled with ?cacheBuster=false
  urlArgs: Date.now()
} );
