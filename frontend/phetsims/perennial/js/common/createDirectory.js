// Copyright 2020, University of Colorado Boulder

/**
 * Creates a directory at the given path
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

'use strict';

const fs = require( 'fs' );
const winston = require( 'winston' );

/**
 * Creates a directory at the given path
 * @public
 *
 * @param {string} path
 * @returns {Promise}
 */
module.exports = function( path ) {
  winston.info( `Creating directory ${path}` );

  return new Promise( ( resolve, reject ) => {
    fs.mkdir( path, err => {
      if ( err ) {
        reject( `createDirectory: ${err}` );
      }
      else {
        resolve();
      }
    } );
  } );
};
