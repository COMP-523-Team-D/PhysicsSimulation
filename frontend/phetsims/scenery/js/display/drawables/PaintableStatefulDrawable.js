// Copyright 2016, University of Colorado Boulder

/**
 * A mixin to drawables for nodes that mix in Paintable that need to store state about what the current display is
 * currently showing, so that updates to the node's fill/stroke will only be made on attributes that specifically
 * changed (and no change will be necessary for an attribute that changed back to its original/currently-displayed
 * value). Generally, this is used for DOM and SVG drawables.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var scenery = require( 'SCENERY/scenery' );
  var PaintObserver = require( 'SCENERY/display/PaintObserver' );
  var Color = require( 'SCENERY/util/Color' );

  var PaintableStatefulDrawable = {
    /**
     * Given the type (constructor) of a drawable, we'll mix in a combination of:
     * - initialization/disposal with the *State suffix
     * - mark* methods to be called on all drawables of nodes of this type, that set specific dirty flags
     * @public (scenery-internal)
     *
     * This will allow drawables that mix in this type to do the following during an update:
     * 1. Check specific dirty flags (e.g. if the fill changed, update the fill of our SVG element).
     * 2. Call setToCleanState() once done, to clear the dirty flags.
     *
     * @param {function} drawableType - The constructor for the drawable type
     */
    mixin: function( drawableType ) {
      var proto = drawableType.prototype;

      /**
       * Initializes the paintable part of the stateful mixin state, starting its "lifetime" until it is disposed with
       * disposePaintableState().
       * @protected
       *
       * @param {number} renderer - Renderer bitmask, see Renderer's documentation for more details.
       * @param {Instance} instance
       * @returns {PaintableStatefulDrawable} - Self reference for chaining
       */
      proto.initializePaintableState = function( renderer, instance ) {
        // @protected {boolean} - Whether the fill has changed since our last update.
        this.dirtyFill = true;

        // @protected {boolean} - Stores whether we last had a stroke.
        this.hadStroke = false;

        // @protected {boolean} - Whether the stroke has changed since our last update.
        this.dirtyStroke = true;

        // @protected {boolean} - Whether the lineWidth has changed since our last update.
        this.dirtyLineWidth = true;

        // @protected {boolean} - Whether the line options (cap, join, dash, dashoffset, miterlimit) have changed since
        //                        our last update.
        this.dirtyLineOptions = true;

        // @protected {boolean} - Whether the cached paints has changed since our last update.
        this.dirtyCachedPaints = true;

        // @protected {Array.<null|string|Color|Property.<string|Color>|LinearGradient|RadialGradient|Pattern>}
        // Stores the last seen cached paints, so we can update our listeners/etc.
        this.lastCachedPaints = [];

        // @private {function} - Callback for when the fill is marked as dirty
        this.fillCallback = this.fillCallback || this.markDirtyFill.bind( this );

        // @private {function} - Callback for when the stroke is marked as dirty
        this.strokeCallback = this.strokeCallback || this.markDirtyStroke.bind( this );

        // @private {PaintObserver} - Observers the fill property for nodes
        this.fillObserver = this.fillObserver || new PaintObserver( 'fill', this.fillCallback );

        // @private {PaintObserver} - Observers the stroke property for nodes
        this.strokeObserver = this.strokeObserver || new PaintObserver( 'stroke', this.strokeCallback );

        // Hook up our fill/stroke observers to this node
        this.fillObserver.initialize( instance.node );
        this.strokeObserver.initialize( instance.node );

        return this;
      };

      /**
       * Cleans the dirty-flag states to the 'not-dirty' option, so that we can listen for future changes.
       * @protected
       */
      proto.cleanPaintableState = function() {
        // TODO: is this being called when we need it to be called?
        this.dirtyFill = false;

        this.dirtyStroke = false;
        this.dirtyLineWidth = false;
        this.dirtyLineOptions = false;
        this.dirtyCachedPaints = false;
        this.hadStroke = this.node.getStroke() !== null;
      };

      /**
       * Disposes the paintable stateful mixin state, so it can be put into the pool to be initialized again.
       * @protected
       */
      proto.disposePaintableState = function() {
        this.fillObserver.clean();
        this.strokeObserver.clean();
      };

      /**
       * Called when the fill of the paintable node changes.
       * @public (scenery-internal)
       */
      proto.markDirtyFill = function() {
        assert && Color.checkPaint( this.instance.node._fill );

        this.dirtyFill = true;
        this.markPaintDirty();
        this.fillObserver.updatePrimary(); // TODO: look into having the fillObserver be notified of Node changes as our source
      };

      /**
       * Called when the stroke of the paintable node changes.
       * @public (scenery-internal)
       */
      proto.markDirtyStroke = function() {
        assert && Color.checkPaint( this.instance.node._stroke );

        this.dirtyStroke = true;
        this.markPaintDirty();
        this.strokeObserver.updatePrimary(); // TODO: look into having the strokeObserver be notified of Node changes as our source
      };

      /**
       * Called when the lineWidth of the paintable node changes.
       * @public (scenery-internal)
       */
      proto.markDirtyLineWidth = function() {
        this.dirtyLineWidth = true;
        this.markPaintDirty();
      };

      /**
       * Called when the line options (lineWidth/lineJoin, etc) of the paintable node changes.
       * @public (scenery-internal)
       */
      proto.markDirtyLineOptions = function() {
        this.dirtyLineOptions = true;
        this.markPaintDirty();
      };

      /**
       * Called when the cached paints of the paintable node changes.
       * @public (scenery-internal)
       */
      proto.markDirtyCachedPaints = function() {
        this.dirtyCachedPaints = true;
        this.markPaintDirty();
      };
    }
  };

  scenery.register( 'PaintableStatefulDrawable', PaintableStatefulDrawable );

  return PaintableStatefulDrawable;
} );
