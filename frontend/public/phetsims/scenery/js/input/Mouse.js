// Copyright 2013-2016, University of Colorado Boulder


/**
 * Tracks the mouse state
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );

  var Vector3 = require( 'DOT/Vector3' );
  var Pointer = require( 'SCENERY/input/Pointer' ); // inherits from Pointer

  function Mouse() {
    Pointer.call( this, null, false );

    this.leftDown = false;
    this.middleDown = false;
    this.rightDown = false;

    // mouse wheel delta and mode for the last event, see https://developer.mozilla.org/en-US/docs/Web/Events/wheel
    this.wheelDelta = new Vector3();
    this.wheelDeltaMode = 0; // 0: pixels, 1: lines, 2: pages
  }

  scenery.register( 'Mouse', Mouse );

  inherit( Pointer, Mouse, {
    type: 'mouse',

    isMouse: true,

    down: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      point && sceneryLog && sceneryLog.InputEvent && sceneryLog.InputEvent( 'mouse down at ' + point.toString() );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      this.isDown = true;
      switch( event.button ) {
        case 0:
          this.leftDown = true;
          break;
        case 1:
          this.middleDown = true;
          break;
        case 2:
          this.rightDown = true;
          break;
        default:
          throw new Error( 'invalid button: ' + event.button );
      }
      return pointChanged;
    },

    up: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      point && sceneryLog && sceneryLog.InputEvent && sceneryLog.InputEvent( 'mouse up at ' + point.toString() );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      this.isDown = false;
      switch( event.button ) {
        case 0:
          this.leftDown = false;
          break;
        case 1:
          this.middleDown = false;
          break;
        case 2:
          this.rightDown = false;
          break;
        default:
          throw new Error( 'invalid button: ' + event.button );
      }
      return pointChanged;
    },

    move: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      point && sceneryLog && sceneryLog.InputEvent && sceneryLog.InputEvent( 'mouse move at ' + point.toString() );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      return pointChanged;
    },

    over: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      point && sceneryLog && sceneryLog.InputEvent && sceneryLog.InputEvent( 'mouse over at ' + point.toString() );
      // if ( this.point ) { this.point.freeToPool(); }
      this.point = point;
      return pointChanged;
    },

    out: function( point, event ) {
      var pointChanged = this.hasPointChanged( point );
      point && sceneryLog && sceneryLog.InputEvent && sceneryLog.InputEvent( 'mouse out at ' + point.toString() );
      // if ( this.point ) { this.point.freeToPool(); }
      // TODO: how to handle the mouse out-of-bounds
      this.point = null;
      return pointChanged;
    },

    wheel: function( event ) {
      this.wheelDelta.setXYZ( event.deltaX, event.deltaY, event.deltaZ );
      this.wheelDeltaMode = event.deltaMode;
    },

    toString: function() {
      return 'Mouse';
    }
  } );

  return Mouse;
} );
