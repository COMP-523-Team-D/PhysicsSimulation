// Copyright 2015, University of Colorado Boulder

/**
 * Creates the namespace for this repository.  By convention, this should have been declared in a file "tandem.js"
 * But that filename was already used for Tandem.js, so we use the alternate convention discussed in:
 * https://github.com/phetsims/tandem/issues/5#issuecomment-162597651
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Namespace = require( 'PHET_CORE/Namespace' );

  return new Namespace( 'tandem' );
} );