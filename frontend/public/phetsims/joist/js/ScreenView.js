// Copyright 2013-2015, University of Colorado Boulder

/**
 * The view portion of a Screen, specifies the layout strategy.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var joist = require( 'JOIST/joist' );
  var Property = require( 'AXON/Property' );

  /*
   * Default width and height for iPad2, iPad3, iPad4 running Safari with default tabs and decorations
   * These bounds were added in Sep 2014 and are based on a screenshot from a non-Retina iPad, in Safari, iOS7.
   * It therefore accounts for the nav bar on the bottom and the space consumed by the browser on the top.
   * As of this writing, this is the resolution being used by PhET's sim designers for their mockups.
   * For more information see https://github.com/phetsims/joist/issues/126
   */
  var DEFAULT_LAYOUT_BOUNDS = new Bounds2( 0, 0, 1024, 618 );

  function ScreenView( options ) {

    options = _.extend( {
      layoutBounds: DEFAULT_LAYOUT_BOUNDS.copy()
    }, options );
    this.layoutBounds = options.layoutBounds;

    Node.call( this, _.extend( {
      layerSplit: true, // so we're not in the same layer as the navbar, etc.
      excludeInvisible: true, // so we don't keep invisible screens in the SVG tree

      // a11y options
      parentContainerTagName: 'article',
      tagName: 'div',
      labelTagName: 'h1',
      prependLabels: true
    }, options ) );

    // The visible bounds of the ScreenView in ScreenView coordinates.  This includes top/bottom or left/right margins
    // depending on the aspect ratio of the screen.
    // Initialize to defaults, then update as soon as layout() is called, which is before the ScreenView is displayed
    // @public (read-only)
    this.visibleBoundsProperty = new Property( options.layoutBounds );

    // @private (a11y) - show/hide accessible content when ScreenView visibility changes
    this.accessibleHiddenListener = this.updateAccessibleHidden.bind( this );
    this.on( 'visibility', this.accessibleHiddenListener );
    this.updateAccessibleHidden();
  }

  joist.register( 'ScreenView', ScreenView );

  return inherit( Node, ScreenView, {

      /**
       * Get the scale to use for laying out the sim components and the navigation bar, so its size will track
       * with the sim size
       * @param {number} width
       * @param {number} height
       * @returns {number}
       * @public (joist-internal)
       */
      getLayoutScale: function( width, height ) {
        return Math.min( width / this.layoutBounds.width, height / this.layoutBounds.height );
      },

      /**
       * Default layout function uses the layoutWidth and layoutHeight to scale the content (based on whichever is more limiting: width or height)
       * and centers the content in the screen vertically and horizontally
       * This function can be replaced by subclasses that wish to perform their own custom layout.
       * @param {number} width
       * @param {number} height
       * @public (joist-internal)
       */
      layout: function( width, height ) {
        this.resetTransform();

        var scale = this.getLayoutScale( width, height );
        this.setScaleMagnitude( scale );

        var dx = 0;
        var dy = 0;

        //center vertically
        if ( scale === width / this.layoutBounds.width ) {
          dy = (height / scale - this.layoutBounds.height ) / 2;
        }

        //center horizontally
        else if ( scale === height / this.layoutBounds.height ) {
          dx = (width / scale - this.layoutBounds.width ) / 2;
        }

        this.translate( dx, dy );

        this.visibleBoundsProperty.set( new Bounds2( -dx, -dy, width / scale - dx, height / scale - dy ) );
      },

      /**
       * Show or hide the accessible content from assistive technology when ScreenView visibility changes. When 
       * hidden, nothing in the ScreenView will be tab navigable. 
       * @public
       */
      updateAccessibleHidden: function() {
        this.accessibleHidden = !this.visible;
      },

      /**
       * Make screen view eligible for garbage collection.
       * @public
       */
      dispose: function() {
        Node.prototype.dispose.call( this );
        this.disposeScreenView();
      }
    },

    //statics
    {
      // @public
      DEFAULT_LAYOUT_BOUNDS: DEFAULT_LAYOUT_BOUNDS
    }
  );
} );