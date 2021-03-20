// Copyright 2016, University of Colorado Boulder

/**
 * SVG drawable for Text nodes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );
  var platform = require( 'PHET_CORE/platform' );
  var SVGSelfDrawable = require( 'SCENERY/display/SVGSelfDrawable' );
  var SelfDrawable = require( 'SCENERY/display/SelfDrawable' );
  var TextStatefulDrawable = require( 'SCENERY/display/drawables/TextStatefulDrawable' );

  // TODO: change this based on memory and performance characteristics of the platform
  var keepSVGTextElements = true; // whether we should pool SVG elements for the SVG rendering states, or whether we should free them when possible for memory

  // Some browsers (IE/Edge) can't handle our UTF-8 embedding marks AND SVG textLength/spacingAndGlyphs. We disable
  // using these features, because they aren't necessary on these browsers.
  // See https://github.com/phetsims/scenery/issues/455 for more information.
  var useSVGTextLengthAdjustments = !platform.ie && !platform.edge;

  /**
   * A generated SVGSelfDrawable whose purpose will be drawing our Text. One of these drawables will be created
   * for each displayed instance of a Text node.
   * @constructor
   *
   * @param {number} renderer - Renderer bitmask, see Renderer's documentation for more details.
   * @param {Instance} instance
   */
  function TextSVGDrawable( renderer, instance ) {
    this.initialize( renderer, instance );
  }

  scenery.register( 'TextSVGDrawable', TextSVGDrawable );

  inherit( SVGSelfDrawable, TextSVGDrawable, {
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
     * @returns {TextSVGDrawable} - Returns 'this' reference, for chaining
     */
    initialize: function( renderer, instance ) {
      // Super-type initialization
      this.initializeSVGSelfDrawable( renderer, instance, true, keepSVGTextElements ); // usesPaint: true

      if ( !this.svgElement ) {
        // @protected {SVGTextElement} - Sole SVG element for this drawable, implementing API for SVGSelfDrawable
        var text = this.svgElement = document.createElementNS( scenery.svgns, 'text' );
        text.appendChild( document.createTextNode( '' ) );

        // TODO: flag adjustment for SVG qualities
        text.setAttribute( 'dominant-baseline', 'alphabetic' ); // to match Canvas right now
        text.setAttribute( 'text-rendering', 'geometricPrecision' );
        if ( useSVGTextLengthAdjustments ) {
          text.setAttribute( 'lengthAdjust', 'spacingAndGlyphs' );
        }
        text.setAttributeNS( 'http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve' );
        text.setAttribute( 'direction', 'ltr' );
      }

      return this;
    },

    /**
     * Updates the SVG elements so that they will appear like the current node's representation.
     * @protected
     *
     * Implements the interface for SVGSelfDrawable (and is called from the SVGSelfDrawable's update).
     */
    updateSVGSelf: function() {
      var text = this.svgElement;

      // set all of the font attributes, since we can't use the combined one
      if ( this.dirtyFont ) {
        text.setAttribute( 'font-family', this.node._font.getFamily() );
        text.setAttribute( 'font-size', this.node._font.getSize() );
        text.setAttribute( 'font-style', this.node._font.getStyle() );
        text.setAttribute( 'font-weight', this.node._font.getWeight() );
        text.setAttribute( 'font-stretch', this.node._font.getStretch() );
      }

      // update the text-node's value
      if ( this.dirtyText ) {
        text.lastChild.nodeValue = this.node.renderedText;
      }

      // text length correction, tested with scenery/tests/text-quality-test.html to determine how to match Canvas/SVG rendering (and overall length)
      if ( this.dirtyBounds && useSVGTextLengthAdjustments && isFinite( this.node.selfBounds.width ) ) {
        text.setAttribute( 'textLength', this.node.selfBounds.width );
      }

      // Apply any fill/stroke changes to our element.
      this.updateFillStrokeStyle( text );
    }
  } );

  TextStatefulDrawable.mixin( TextSVGDrawable );

  // This sets up TextSVGDrawable.createFromPool/dirtyFromPool and drawable.freeToPool() for the type, so
  // that we can avoid allocations by reusing previously-used drawables.
  SelfDrawable.Poolable.mixin( TextSVGDrawable );

  return TextSVGDrawable;
} );
