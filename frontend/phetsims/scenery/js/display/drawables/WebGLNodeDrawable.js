// Copyright 2016, University of Colorado Boulder

/**
 * WebGL drawable for WebGLNode.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Renderer = require( 'SCENERY/display/Renderer' );
  var WebGLSelfDrawable = require( 'SCENERY/display/WebGLSelfDrawable' );
  var SelfDrawable = require( 'SCENERY/display/SelfDrawable' );

  // Use a Float32Array-backed matrix, as it's better for usage with WebGL
  var modelViewMatrix = new Matrix3().setTo32Bit();

  /**
   * A generated WebGLSelfDrawable whose purpose will be drawing our WebGLNode. One of these drawables will be created
   * for each displayed instance of a WebGLNode.
   * @constructor
   *
   * @param {number} renderer - Renderer bitmask, see Renderer's documentation for more details.
   * @param {Instance} instance
   */
  function WebGLNodeDrawable( renderer, instance ) {
    this.initialize( renderer, instance );
  }

  scenery.register( 'WebGLNodeDrawable', WebGLNodeDrawable );

  inherit( WebGLSelfDrawable, WebGLNodeDrawable, {
    // What type of WebGL renderer/processor should be used. TODO: doc
    webglRenderer: Renderer.webglCustom,

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
     * @returns {WebGLNodeDrawable} - For chaining
     */
    initialize: function( renderer, instance ) {
      // @private {function}
      this.contextChangeListener = this.onWebGLContextChange.bind( this );

      // @private {*} - Will be set to whatever type node.painterType is.
      this.painter = null;

      return this.initializeWebGLSelfDrawable( renderer, instance );
    },

    /**
     * Creates an instance of our Node's "painter" type.
     * @private
     *
     * @returns {*} - Whatever node.painterType is will be the type.
     */
    createPainter: function() {
      var PainterType = this.node.painterType;
      return new PainterType( this.webGLBlock.gl, this.node );
    },

    /**
     * Callback for when the WebGL context changes. We'll reconstruct the painter.
     * @public (scenery-internal)
     */
    onWebGLContextChange: function() {
      //TODO: Should a function be added for "disposeNonWebGL"?

      // Create the new painter
      this.painter = this.createPainter();
    },

    onAddToBlock: function( webGLBlock ) {
      // @private {WebGLBlock}
      this.webGLBlock = webGLBlock;

      this.painter = this.createPainter();

      webGLBlock.glChangedEmitter.addListener( this.contextChangeListener );
    },

    onRemoveFromBlock: function( webGLBlock ) {
      webGLBlock.glChangedEmitter.removeListener( this.contextChangeListener );
    },

    draw: function() {
      // we have a precompute need
      var matrix = this.instance.relativeTransform.matrix;

      modelViewMatrix.set( matrix );

      var painted = this.painter.paint( modelViewMatrix, this.webGLBlock.projectionMatrix );

      assert && assert( painted === scenery.WebGLNode.PAINTED_SOMETHING || painted === scenery.WebGLNode.PAINTED_NOTHING );
      assert && assert( scenery.WebGLNode.PAINTED_NOTHING === 0 && scenery.WebGLNode.PAINTED_SOMETHING === 1,
        'Ensure we can pass the value through directly to indicate whether draw calls were made' );

      return painted;
    },

    /**
     * Disposes the drawable.
     * @public
     * @override
     */
    dispose: function() {
      this.painter.dispose();
      this.painter = null;

      if ( this.webGLBlock ) {
        this.webGLBlock = null;
      }

      // super
      WebGLSelfDrawable.prototype.dispose.call( this );
    },

    /**
     * A "catch-all" dirty method that directly marks the paintDirty flag and triggers propagation of dirty
     * information. This can be used by other mark* methods, or directly itself if the paintDirty flag is checked.
     * @public (scenery-internal)
     *
     * It should be fired (indirectly or directly) for anything besides transforms that needs to make a drawable
     * dirty.
     */
    markPaintDirty: function() {
      this.markDirty();
    },

    // forward call to the WebGLNode
    get shaderAttributes() {
      return this.node.shaderAttributes;
    },

    update: function() {
      this.dirty = false;
    }
  } );

  // This sets up WebGLNodeDrawable.createFromPool/dirtyFromPool and drawable.freeToPool() for the type, so
  // that we can avoid allocations by reusing previously-used drawables.
  SelfDrawable.Poolable.mixin( WebGLNodeDrawable ); // pooling

  return WebGLNodeDrawable;
} );
