// Copyright 2013-2015, University of Colorado Boulder

/**
 * Tracks a single touch point
 *
 * IE guidelines for Touch-friendly sites: http://blogs.msdn.com/b/ie/archive/2012/04/20/guidelines-for-building-touch-friendly-sites.aspx
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );

  var Pointer = require( 'SCENERY/input/Pointer' ); // extends Pointer

  function Touch( id, point, event ) {
    Pointer.call( this, point, true ); // true: touches always start in the down state

    this.id = id;
  }

  scenery.register( 'Touch', Touch );

  inherit( Pointer, Touch, {
    type: 'touch',

    isTouch: true,

    move: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      return pointChanged;
    },

    end: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      this.isDown = false;
      return pointChanged;
    },

    cancel: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      this.isDown = false;
      return pointChanged;
    },

    toString: function() {
      return 'Touch#' + this.id;
    }
  } );

  return Touch;
} );
