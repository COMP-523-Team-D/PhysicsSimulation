// Copyright 2016, University of Colorado Boulder

/**
 * WebGL drawable for Rectangle nodes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var WebGLSelfDrawable = require( 'SCENERY/display/WebGLSelfDrawable' );
  var RectangleStatefulDrawable = require( 'SCENERY/display/drawables/RectangleStatefulDrawable' );
  var SelfDrawable = require( 'SCENERY/display/SelfDrawable' );
  var Renderer = require( 'SCENERY/display/Renderer' );
  var Color = require( 'SCENERY/util/Color' );

  var scratchColor = new Color( 'transparent' );

  /**
   * A generated WebGLSelfDrawable whose purpose will be drawing our Rectangle. One of these drawables will be created
   * for each displayed instance of a Rectangle.
   * @constructor
   *
   * NOTE: This drawable currently only supports solid fills and no strokes.
   *
   * @param {number} renderer - Renderer bitmask, see Renderer's documentation for more details.
   * @param {Instance} instance
   */
  function RectangleWebGLDrawable( renderer, instance ) {
    this.initialize( renderer, instance );
  }

  scenery.register( 'RectangleWebGLDrawable', RectangleWebGLDrawable );

  inherit( WebGLSelfDrawable, RectangleWebGLDrawable, {
    webglRenderer: Renderer.webglVertexColorPolygons,

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
     * @returns {RectangleWebGLDrawable} - Returns 'this' reference, for chaining
     */
    initialize: function( renderer, instance ) {
      this.initializeWebGLSelfDrawable( renderer, instance );

      // Stateful mix-in initialization
      this.initializeState( renderer, instance );

      if ( !this.vertexArray ) {
        // format [X Y R G B A] for all vertices
        this.vertexArray = new Float32Array( 6 * 6 ); // 6-length components for 6 vertices (2 tris).
      }

      // corner vertices in the relative transform root coordinate space
      this.upperLeft = new Vector2();
      this.lowerLeft = new Vector2();
      this.upperRight = new Vector2();
      this.lowerRight = new Vector2();

      this.transformDirty = true;
      this.includeVertices = true; // used by the processor

      return this;
    },

    onAddToBlock: function( webglBlock ) {
      this.webglBlock = webglBlock; // TODO: do we need this reference?
      this.markDirty();
    },

    onRemoveFromBlock: function( webglBlock ) {
    },

    // @override
    markTransformDirty: function() {
      this.transformDirty = true;

      WebGLSelfDrawable.prototype.markTransformDirty.call( this );
    },

    update: function() {
      if ( this.dirty ) {
        this.dirty = false;

        if ( this.dirtyFill ) {
          this.includeVertices = this.node.hasFill();

          if ( this.includeVertices ) {
            var fill = ( this.node.fill instanceof Property ) ? this.node.fill.value : this.node.fill;
            var color =  scratchColor.set( fill );
            var red = color.red / 255;
            var green = color.green / 255;
            var blue = color.blue / 255;
            var alpha = color.alpha;

            for ( var i = 0; i < 6; i++ ) {
              var offset = i * 6;
              this.vertexArray[ 2 + offset ] = red;
              this.vertexArray[ 3 + offset ] = green;
              this.vertexArray[ 4 + offset ] = blue;
              this.vertexArray[ 5 + offset ] = alpha;
            }
          }
        }

        if ( this.transformDirty || this.dirtyX || this.dirtyY || this.dirtyWidth || this.dirtyHeight ) {
          this.transformDirty = false;

          var x = this.node._rectX;
          var y = this.node._rectY;
          var width = this.node._rectWidth;
          var height = this.node._rectHeight;

          var transformMatrix = this.instance.relativeTransform.matrix; // with compute need, should always be accurate
          transformMatrix.multiplyVector2( this.upperLeft.setXY( x, y ) );
          transformMatrix.multiplyVector2( this.lowerLeft.setXY( x, y + height ) );
          transformMatrix.multiplyVector2( this.upperRight.setXY( x + width, y ) );
          transformMatrix.multiplyVector2( this.lowerRight.setXY( x + width, y + height ) );

          // first triangle XYs
          this.vertexArray[ 0 ] = this.upperLeft.x;
          this.vertexArray[ 1 ] = this.upperLeft.y;
          this.vertexArray[ 6 ] = this.lowerLeft.x;
          this.vertexArray[ 7 ] = this.lowerLeft.y;
          this.vertexArray[ 12 ] = this.upperRight.x;
          this.vertexArray[ 13 ] = this.upperRight.y;

          // second triangle XYs
          this.vertexArray[ 18 ] = this.upperRight.x;
          this.vertexArray[ 19 ] = this.upperRight.y;
          this.vertexArray[ 24 ] = this.lowerLeft.x;
          this.vertexArray[ 25 ] = this.lowerLeft.y;
          this.vertexArray[ 30 ] = this.lowerRight.x;
          this.vertexArray[ 31 ] = this.lowerRight.y;
        }
      }

      this.setToCleanState();
      this.cleanPaintableState();
    },

    /**
     * Disposes the drawable.
     * @public
     * @override
     */
    dispose: function() {
      // TODO: disposal of buffers?

      this.disposeState();

      // super
      WebGLSelfDrawable.prototype.dispose.call( this );
    }
  } );

  RectangleStatefulDrawable.mixin( RectangleWebGLDrawable );

  // This sets up RectangleWebGLDrawable.createFromPool/dirtyFromPool and drawable.freeToPool() for the type, so
  // that we can avoid allocations by reusing previously-used drawables.
  SelfDrawable.Poolable.mixin( RectangleWebGLDrawable );

  return RectangleWebGLDrawable;
} );
