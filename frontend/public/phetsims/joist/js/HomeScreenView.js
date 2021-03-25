// Copyright 2013-2015, University of Colorado Boulder

/**
 * Shows the home screen for a multi-screen simulation, which lets the user see all of the screens and select one.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhetButton = require( 'JOIST/PhetButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ScreenButton = require( 'JOIST/ScreenButton' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var joist = require( 'JOIST/joist' );


  // constants
  var LAYOUT_BOUNDS = new Bounds2( 0, 0, 768, 504 );

  // iPad doesn't support Century Gothic, so fall back to Futura, see http://wordpress.org/support/topic/font-not-working-on-ipad-browser
  var TITLE_FONT_FAMILY = 'Century Gothic, Futura';

  /**
   * @param {Sim} sim
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function HomeScreenView( sim, tandem, options ) {
    var self = this;

    options = _.extend( {
      showSmallHomeScreenIconFrame: false,
      warningNode: null // {Node | null}, to display below the icons as a warning if available
    }, options );

    // Rendering in SVG seems to solve the problem that the home screen consumes 100% disk and crashes, see
    // https://github.com/phetsims/joist/issues/17.  This also makes it more responsive (and crisper on retina
    // displays). The renderer must be specified here because the node is added directly to the scene (instead of to
    // some other node that already has svg renderer).
    ScreenView.call( this, { layoutBounds: LAYOUT_BOUNDS } );

    var title = new Text( sim.name, {
      font: new PhetFont( {
        size: 52,
        family: TITLE_FONT_FAMILY
      } ),
      fill: 'white',
      y: 110,
      tandem: tandem.createTandem( 'title' )
    } );
    this.addChild( title );
    title.scale( Math.min( 1, 0.9 * this.layoutBounds.width / title.width ) );
    title.centerX = this.layoutBounds.centerX;

    // Keep track of which screen is highlighted so the same screen can remain highlighted even if nodes are replaced
    // (say when one grows larger or smaller).
    var highlightedScreenIndexProperty = new Property( -1 );

    var screenChildren = _.map( sim.screens, function( screen ) {

      assert && assert( screen.name, 'name is required for screen ' + sim.screens.indexOf( screen ) );
      assert && assert( screen.homeScreenIcon, 'homeScreenIcon is required for screen ' + screen.name );

      var index = sim.screens.indexOf( screen );

      // Even though in the user interface the small and large buttons seem like a single UI component that has grown
      // larger, it would be quite a headache to create a composite button for the purposes of tandem, so instead the
      // large and small buttons are registered as separate instances.  See https://github.com/phetsims/phet-io/issues/99
      var largeTandem = tandem.createTandem( screen.tandem.tail + 'LargeButton' );

      var isLarge = true;
      var largeScreenButton = new ScreenButton(
        isLarge,
        sim,
        index,
        highlightedScreenIndexProperty,
        largeTandem,
        {
          // Don't 40 the VBox or it will shift down when the border becomes thicker
          resize: false,
          cursor: 'pointer'
        } );

      // Even though in the user interface the small and large buttons seem like a single UI component that has grown
      // larger, it would be quite a headache to create a composite button for the purposes of tandem, so instead the
      // large and small buttons are registered as separate instances.  See https://github.com/phetsims/phet-io/issues/99
      var smallTandem = tandem.createTandem( screen.tandem.tail + 'SmallButton' );

      isLarge = false;
      var smallScreenButton = new ScreenButton(
        isLarge,
        sim,
        index,
        highlightedScreenIndexProperty,
        smallTandem,
        {
          spacing: 3,
          cursor: 'pointer',
          showSmallHomeScreenIconFrame: options.showSmallHomeScreenIconFrame,
        }
      );


      smallScreenButton.addInputListener( smallScreenButton.highlightListener );
      largeScreenButton.addInputListener( smallScreenButton.highlightListener );
      // largeScreenButton.mouseArea = largeScreenButton.touchArea = Shape.bounds( largeScreenButton.bounds ); // cover the gap in the vbox


      return { screen: screen, small: smallScreenButton, large: largeScreenButton, index: index };
    } );

    // Intermediate node, so that icons are always in the same rendering layer
    var iconsParentNode = new Node();
    self.addChild( iconsParentNode );

    // Space the icons out more if there are fewer, so they will be spaced nicely.
    // Cannot have only 1 screen because for 1-screen sims there is no home screen.
    var spacing = ( sim.screens.length <= 3 ) ? 60 : 33;

    var hBox = null;
    sim.screenIndexProperty.link( function( screenIndex ) {

      // remove previous layout of icons
      if ( hBox ) {
        hBox.removeAllChildren(); // because icons have reference to hBox (their parent)
        iconsParentNode.removeChild( hBox );
      }

      // add new layout of icons
      var icons = _.map( screenChildren, function( screenChild ) {return screenChild.index === screenIndex ? screenChild.large : screenChild.small;} );
      hBox = new HBox( { spacing: spacing, children: icons, align: 'top', resize: false } );
      iconsParentNode.addChild( hBox );

      // position the icons
      iconsParentNode.centerX = self.layoutBounds.width / 2;
      iconsParentNode.top = 170;
    } );

    //TODO move these Properties to LookAndFeel, see https://github.com/phetsims/joist/issues/255
    var homeScreenFillProperty = new Property( 'black' );
    var homeScreenTextFillProperty = new Property( 'white' );

    // @public (joist-internal) - This PhET button is public since our creator (Sim.js) is responsible for positioning
    // this button. See https://github.com/phetsims/joist/issues/304.
    this.phetButton = new PhetButton( sim, homeScreenFillProperty, homeScreenTextFillProperty, tandem.createTandem( 'phetButton' ) );
    this.addChild( this.phetButton );

    if ( options.warningNode ) {
      var warningNode = options.warningNode;

      this.addChild( warningNode );
      warningNode.centerX = this.layoutBounds.centerX;
      warningNode.bottom = this.layoutBounds.maxY - 20;
    }
  }

  joist.register( 'HomeScreenView', HomeScreenView );

  return inherit( ScreenView, HomeScreenView, {},
    // @public - statics
    {
      TITLE_FONT_FAMILY: TITLE_FONT_FAMILY,
      LAYOUT_BOUNDS: LAYOUT_BOUNDS
    }
  );
} );