// Copyright 2015-2016, University of Colorado Boulder

/**
 * A mixin for subtypes of Node, used to prevent children being added/removed to that subtype of Node.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var scenery = require( 'SCENERY/scenery' );

  var Leaf = {
    /**
     * Removes the capability to insert children when this is mixed into a type.
     * @public
     * @mixin
     *
     * @param {function} type - The type (constructor) whose prototype we'll modify so that it can't have children.
     */
    mixin: function( type ) {
      var proto = type.prototype;

      /**
       * @override
       */
      proto.insertChild = function( index, node ) {
        throw new Error( 'Attempt to insert child into Leaf' );
      };

      /**
       * @override
       */
      proto.removeChildWithIndex = function( node, indexOfChild ) {
        throw new Error( 'Attempt to remove child from Leaf' );
      };
    }
  };
  scenery.register( 'Leaf', Leaf );

  return scenery.Leaf;
} );
