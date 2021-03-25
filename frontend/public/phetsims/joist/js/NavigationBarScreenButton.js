// Copyright 2013-2015, University of Colorado Boulder

/**
 * Button for a single screen in the navigation bar, shows the text and the navigation bar icon.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SUN/buttons/ButtonListener' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HighlightNode = require( 'JOIST/HighlightNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var PushButtonModel = require( 'SUN/buttons/PushButtonModel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var joist = require( 'JOIST/joist' );
  var Tandem = require( 'TANDEM/Tandem' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var TNavigationBarScreenButton = require( 'JOIST/TNavigationBarScreenButton' );

  // constants
  var HIGHLIGHT_SPACING = 4;

  /**
   * Create a nav bar.  Layout assumes all of the screen widths are the same.
   * @param {Property.<string>} navigationBarFillProperty - the color of the navbar, as a string.
   * @param {Property.<number>} screenIndexProperty
   * @param {Array.<Screen>} screens - all of the available sim content screens (excluding the home screen)
   * @param {Screen} screen
   * @param {number} navBarHeight
   * @param {Object} [options]
   * @constructor
   */
  function NavigationBarScreenButton( navigationBarFillProperty, screenIndexProperty, screens, screen, navBarHeight, options ) {

    assert && assert( screen.name, 'name is required for screen ' + screens.indexOf( screen ) );
    assert && assert( screen.navigationBarIcon, 'navigationBarIcon is required for screen ' + screen.name );

    function clicked() {
      screenIndexProperty.value = screens.indexOf( screen );
    }

    options = _.extend( {
      cursor: 'pointer',
      textDescription: screen.name + ' Screen: Button',
      tandem: Tandem.tandemRequired(),
      phetioType: TNavigationBarScreenButton,
      maxButtonWidth: null // {number|null} the maximum width of the button, causes text and/or icon to be scaled down if necessary
    }, options );

    Node.call( this );

    // icon
    var icon = new Node( {
      children: [ screen.navigationBarIcon ], // wrap in case this icon is used in multiple place (eg, home screen and navbar)
      maxHeight: 0.625 * navBarHeight,
      tandem: options.tandem.createTandem( 'icon' )
    } );

    // Is this button's screen selected?
    var selectedProperty = new DerivedProperty( [ screenIndexProperty ], function( screenIndex ) {
      return screenIndex === screens.indexOf( screen );
    } );

    // @public (phet-io) - create the button model, needs to be public so that PhET-iO wrappers can hook up to it if needed
    this.buttonModel = new PushButtonModel( {
      listener: clicked
    } );
    this.addInputListener( new ButtonListener( this.buttonModel ) );

    var text = new Text( screen.name, {
      font: new PhetFont( 10 ),
      tandem: options.tandem.createTandem( 'text' )
    } );

    var box = new VBox( {
      children: [ icon, text ],
      pickable: false,
      spacing: Math.max( 0, 12 - text.height ), // see https://github.com/phetsims/joist/issues/143
      usesOpacity: true, // hint, since we change its opacity
      maxHeight: navBarHeight
    } );

    // add a transparent overlay for input handling and to size touchArea/mouseArea
    var overlay = new Rectangle( 0, 0, box.width, box.height, { center: box.center } );

    // highlights
    var highlightWidth = overlay.width + ( 2 * HIGHLIGHT_SPACING );
    var brightenHighlight = new HighlightNode( highlightWidth, overlay.height, {
      center: box.center,
      fill: 'white'
    } );
    var darkenHighlight = new HighlightNode( highlightWidth, overlay.height, {
      center: box.center,
      fill: 'black'
    } );

    this.addChild( box );
    this.addChild( overlay );
    this.addChild( brightenHighlight );
    this.addChild( darkenHighlight );

    // manage interaction feedback
    Property.multilink( [
      selectedProperty,
      this.buttonModel.downProperty,
      this.buttonModel.overProperty,
      navigationBarFillProperty
    ], function update( selected, down, over, navigationBarFill ) {

      var useDarkenHighlights = ( navigationBarFill !== 'black' );

      // Color match yellow with the PhET Logo
      var selectedTextColor = useDarkenHighlights ? 'black' : PhetColorScheme.PHET_LOGO_YELLOW;
      var unselectedTextColor = useDarkenHighlights ? 'gray' : 'white';

      text.fill = selected ? selectedTextColor : unselectedTextColor;
      box.opacity = selected ? 1.0 : ( down ? 0.65 : 0.5 );
      brightenHighlight.visible = !useDarkenHighlights && ( over || down );
      darkenHighlight.visible = useDarkenHighlights && ( over || down );
    } );

    // Constrain text and icon width, if necessary
    if ( options.maxButtonWidth && ( this.width > options.maxButtonWidth ) ) {

      text.maxWidth = icon.maxWidth = options.maxButtonWidth - ( this.width - box.width );

      // adjust the overlay
      overlay.setRect( 0, 0, box.width, overlay.height );
      overlay.center = box.center;

      // adjust the highlights
      brightenHighlight.spacing = darkenHighlight.spacing = overlay.width + ( 2 * HIGHLIGHT_SPACING );
      brightenHighlight.center = darkenHighlight.center = box.center;

      assert && assert( Util.toFixed( this.width, 0 ) === Util.toFixed( options.maxButtonWidth, 0 ) );
    }

    this.mutate( options );
  }

  joist.register( 'NavigationBarScreenButton', NavigationBarScreenButton );

  return inherit( Node, NavigationBarScreenButton );
} );
