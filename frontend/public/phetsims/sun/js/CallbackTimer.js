// Copyright 2015, University of Colorado Boulder

/**
 * Timer that calls a set of registered callbacks.
 * Utilizes joist.Timer, but provides a higher level of abstraction, hiding the details of managing the timer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Timer = require( 'PHET_CORE/Timer' );
  var sun = require( 'SUN/sun' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function CallbackTimer( options ) {

    options = _.extend( {
      callback: null, // {function} convenience for adding 1 callback
      delay: 400, // {number} start to fire continuously after pressing for this long (milliseconds)
      interval: 100 // {number} fire continuously at this interval (milliseconds)
    }, options );

    // validate options
    assert && assert( options.delay >= 0, 'bad value for delay: ' + options.delay );
    assert && assert( options.interval > 0, 'bad value for interval: ' + options.interval );

    this.delay = options.delay; // @private
    this.interval = options.interval; // @private

    this.callbacks = []; // @private
    if ( options.callback ) { this.callbacks.push( options.callback ); }

    this.delayID = null; // @private identifier for timer associated with the initial delay
    this.intervalID = null; // @private identifier for timer associates with the continuous interval
    this.fired = false;  // @private has the timer fired since it was started?
  }

  sun.register( 'CallbackTimer', CallbackTimer );

  return inherit( Object, CallbackTimer, {

    // @public Is the timer running?
    isRunning: function() {
      return ( this.delayID !== null || this.intervalID !== null );
    },

    // @public Starts the timer.
    start: function() {
      var self = this;
      if ( !self.isRunning() ) {
        self.fired = false;
        self.delayID = Timer.setTimeout( function() {

          self.delayID = null;

          self.intervalID = Timer.setInterval( function() {
            self.fire();
          }, self.interval );

          // fire after scheduling the intervalID, so that isRunning will be true for callbacks, see sun#216
          self.fire();

        }, self.delay );
      }
    },

    /**
     * Stops the timer.
     * @param {boolean} fire - should we fire if we haven't fired already?
     * @public
     */
    stop: function( fire ) {
      if ( this.isRunning() ) {
        if ( this.delayID ) {
          Timer.clearTimeout( this.delayID );
          this.delayID = null;
        }
        if ( this.intervalID ) {
          Timer.clearInterval( this.intervalID );
          this.intervalID = null;
        }
        if ( fire && !this.fired ) {
          this.fire();
        }
      }
    },

    // @public Adds a {function} callback.
    addCallback: function( callback ) {
      if ( this.callbacks.indexOf( callback ) === -1 ) {
        this.callbacks.push( callback );
      }
    },

    // @public Removes a {function} callback.
    removeCallback: function( callback ) {
      var index = this.callbacks.indexOf( callback );
      if ( index !== -1 ) {
        this.callbacks.splice( index, 1 );
      }
    },

    /**
     * Calls all callbacks.
     * Clients are free to call this when the timer is not running.
     * @public
     */
    fire: function() {
      var callbacksCopy = this.callbacks.slice( 0 );
      for ( var i = 0; i < callbacksCopy.length; i++ ) {
        callbacksCopy[ i ]();
      }
      this.fired = true;
    },

    dispose: function() {
      this.stop();
      this.callbacks.length = 0;
    }
  } );
} );
