// Copyright 2018, University of Colorado Boulder

/**
 * Checks whether we are somewhere that would have access to phet-server.int.colorado.edu (implies access to bayes).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

'use strict';

const dns = require( 'dns' );

/**
 * Checks whether we are somewhere that would have access to phet-server.int.colorado.edu (implies access to bayes).
 * @public
 *
 * @returns {Promise.<boolean>} - Whether the directory exists
 */
module.exports = function() {
  return new Promise( ( resolve, reject ) => {
    dns.resolve( 'phet-server.int.colorado.edu', err => {
      resolve( !err );
    } );
  } );
};
