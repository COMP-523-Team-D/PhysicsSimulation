// Copyright 2013-2016, University of Colorado Boulder

/**
 * A Scenery Event is an abstraction over incoming user DOM events.
 *
 * It provides more information (particularly Scenery-related information), and handles a single pointer at a time
 * (DOM TouchEvents can include information for multiple touches at the same time, so the TouchEvent can be passed to
 * multiple Scenery events). Thus it is not save to assume that the DOM event is unique, as it may be shared.
 *
 * NOTE: While the event is being dispatched, its currentTarget may be changed. It is not fully immutable.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );
  var Trail = require( 'SCENERY/util/Trail' );
  var Pointer = require( 'SCENERY/input/Pointer' );

  /**
   * @constructor
   *
   * @param {Trail} trail - The trail to the node picked/hit by this input event.
   * @param {string} type - Type of the event, e.g. 'string'
   * @param {Pointer} pointer - The pointer that triggered this event
   * @param {DOM Event} domEvent - The original DOM Event that caused this Event to fire.
   */
  function Event( trail, type, pointer, domEvent ) {
    assert && assert( trail instanceof Trail, 'Event\'s trail parameter should be a {Trail}' );
    assert && assert( typeof type === 'string', 'Event\'s type should be a {string}' );
    assert && assert( pointer instanceof Pointer, 'Event\'s pointer parameter should be a {Pointer}' );
    // TODO: add domEvent type assertion -- will browsers support this?

    // @public {boolean} - Whether this Event has been 'handled'. If so, it will not bubble further.
    this.handled = false;

    // @public {boolean} - Whether this Event has been 'aborted'. If so, no further listeners with it will fire.
    this.aborted = false;

    // @public {Trail} - Path to the leaf-most node "hit" by the event, ordered list, from root to leaf
    this.trail = trail;

    // @public {string} - What event was triggered on the listener, e.g. 'move'
    this.type = type;

    // @public {Pointer} - The pointer that triggered this event
    this.pointer = pointer;

    // @public {DOM Event} - Raw DOM InputEvent (TouchEvent, PointerEvent, MouseEvent,...)
    this.domEvent = domEvent;

    // @public {Node|null} - whatever node you attached the listener to, or null when firing events on a Pointer
    this.currentTarget = null;

    // @public {Node} - Leaf-most node in trail
    this.target = trail.lastNode();

    // @public {boolean} - Whether this is the 'primary' mode for the pointer. Always true for touches, and will be true
    // for the mouse if it is the primary (left) mouse button.
    // TODO: don't require check on domEvent (seems sometimes this is passed as null as a hack?)
    this.isPrimary = !pointer.isMouse || !domEvent || domEvent.button === 0;
  }

  scenery.register( 'Event', Event );

  inherit( Object, Event, {
    // like DOM Event.stopPropagation(), but named differently to indicate it doesn't fire that behavior on the underlying DOM event
    handle: function() {
      this.handled = true;
    },

    // like DOM Event.stopImmediatePropagation(), but named differently to indicate it doesn't fire that behavior on the underlying DOM event
    abort: function() {
      this.aborted = true;
    },

    /**
     * Returns whether a typical PressListener (that isn't already attached) could start a drag with this event.
     * @public
     *
     * This can typically be used for patterns where no action should be taken if a press can't be started, e.g.:
     *
     *   down: function( event ) {
     *     if ( !event.canStartPress() ) { return; }
     *
     *     // ... Do stuff to create a node with some type of PressListener
     *
     *     dragListener.press( event );
     *   }
     *
     * NOTE: This ignores non-left mouse buttons (as this is the typical behavior). Custom checks should be done if this
     *       is not suitable.
     *
     * @returns {boolean}
     */
    canStartPress: function() {
      // If the pointer is already attached (some other press probably), it can't start a press.
      // Additionally, we generally want to ignore non-left mouse buttons.
      return !this.pointer.isAttached() && ( !this.pointer.isMouse || this.domEvent.button === 0 );
    }
  } );

  return Event;
} );
