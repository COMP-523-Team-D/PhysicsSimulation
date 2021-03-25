// Copyright 2016, University of Colorado Boulder

/**
 * SVG drawable for Line nodes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );
  var SVGSelfDrawable = require( 'SCENERY/display/SVGSelfDrawable' );
  var SelfDrawable = require( 'SCENERY/display/SelfDrawable' );
  var LineStatefulDrawable = require( 'SCENERY/display/drawables/LineStatefulDrawable' );

  // TODO: change this based on memory and performance characteristics of the platform
  var keepSVGLineElements = true; // whether we should pool SVG elements for the SVG rendering states, or whether we should free them when possible for memory

  /*---------------------------------------------------------------------------*
   * SVG Rendering
   *----------------------------------------------------------------------------*/

  /**
   * A generated SVGSelfDrawable whose purpose will be drawing our Line. One of these drawables will be created
   * for each displayed instance of a Line.
   * @constructor
   *
   * @param {number} renderer - Renderer bitmask, see Renderer's documentation for more details.
   * @param {Instance} instance
   */
  function LineSVGDrawable( renderer, instance ) {
    this.initialize( renderer, instance );
  }

  scenery.register( 'LineSVGDrawable', LineSVGDrawable );

  inherit( SVGSelfDrawable, LineSVGDrawable, {
    /**
     * Initializes this drawable, starting its "lifetime" until it is disposed. This lifecycle can happen multiple
     * times, with instances generally created by the SelfDrawable.Poolable mixin (dirtyFromPool/createFromPool), and
     * disposal will return this drawable to the pool.
     * @public (scenery-internal)
     *
     * This acts as a pseudo-constructor that can be called multiple times, and effectively creates/resets the state
     * of the drawable to the initial state.
     *
     * @param {number} renderer - Renderer bitmask, see Renderer's documentation for more details.
     * @param {Instance} instance
     * @returns {LineSVGDrawable} - Self reference for chaining
     */
    initialize: function( renderer, instance ) {
      // Super-type initialization
      this.initializeSVGSelfDrawable( renderer, instance, true, keepSVGLineElements ); // usesPaint: true

      // @protected {SVGLineElement} - Sole SVG element for this drawable, implementing API for SVGSelfDrawable
      this.svgElement = this.svgElement || document.createElementNS( scenery.svgns, 'line' );

      return this;
    },

    /**
     * Updates the SVG elements so that they will appear like the current node's representation.
     * @protected
     *
     * Implements the interface for SVGSelfDrawable (and is called from the SVGSelfDrawable's update).
     */
    updateSVGSelf: function() {
      var line = this.svgElement;

      if ( this.dirtyX1 ) {
        line.setAttribute( 'x1', this.node._x1 );
      }
      if ( this.dirtyY1 ) {
        line.setAttribute( 'y1', this.node._y1 );
      }
      if ( this.dirtyX2 ) {
        line.setAttribute( 'x2', this.node._x2 );
      }
      if ( this.dirtyY2 ) {
        line.setAttribute( 'y2', this.node._y2 );
      }

      // Apply any fill/stroke changes to our element.
      this.updateFillStrokeStyle( line );
    }
  } );
  LineStatefulDrawable.mixin( LineSVGDrawable );
  // This sets up LineSVGDrawable.createFromPool/dirtyFromPool and drawable.freeToPool() for the type, so
  // that we can avoid allocations by reusing previously-used drawables.
  SelfDrawable.Poolable.mixin( LineSVGDrawable );

  return LineSVGDrawable;
} );
