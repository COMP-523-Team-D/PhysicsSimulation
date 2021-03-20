// Copyright 2013-2016, University of Colorado Boulder

/**
 * HBox is a convenience specialization of LayoutBox with horizontal orientation.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var scenery = require( 'SCENERY/scenery' );

  /**
   * @public
   * @constructor
   * @extends LayoutBox
   *
   * @param {Object} [options] see LayoutBox
   */
  function HBox( options ) {
    assert && assert( options === undefined || Object.getPrototypeOf( options ) === Object.prototype,
      'Extra prototype on Node options object is a code smell' );

    LayoutBox.call( this, _.extend( {}, options, { orientation: 'horizontal' } ) );
  }

  scenery.register( 'HBox', HBox );

  return inherit( LayoutBox, HBox );
} );
