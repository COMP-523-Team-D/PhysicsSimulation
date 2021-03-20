// Copyright 2013-2017, University of Colorado Boulder

/**
 * Main class that represents one simulation.
 * Provides default initialization, such as polyfills as well.
 * If the simulation has only one screen, then there is no homescreen, home icon or screen icon in the navigation bar.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Features = require( 'SCENERY/util/Features' );
  var NavigationBar = require( 'JOIST/NavigationBar' );
  var HomeScreen = require( 'JOIST/HomeScreen' );
  var HomeScreenView = require( 'JOIST/HomeScreenView' );
  var UpdateCheck = require( 'JOIST/UpdateCheck' );
  var Util = require( 'SCENERY/util/Util' );
  var Display = require( 'SCENERY/display/Display' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var platform = require( 'PHET_CORE/platform' );
  var Timer = require( 'PHET_CORE/Timer' );
  var BarrierRectangle = require( 'SCENERY_PHET/BarrierRectangle' );
  var Profiler = require( 'JOIST/Profiler' );
  var LookAndFeel = require( 'JOIST/LookAndFeel' );
  var ScreenshotGenerator = require( 'JOIST/ScreenshotGenerator' );
  var packageJSON = require( 'JOIST/packageJSON' );
  var PhetButton = require( 'JOIST/PhetButton' );
  var joist = require( 'JOIST/joist' );
  var Tandem = require( 'TANDEM/Tandem' );
  var DotUtil = require( 'DOT/Util' );// eslint-disable-line
  var Emitter = require( 'AXON/Emitter' );
  var TSim = require( 'JOIST/TSim' );
  var LegendsOfLearningSupport = require( 'JOIST/thirdPartySupport/LegendsOfLearningSupport' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  // constants
  var PROGRESS_BAR_WIDTH = 273;

  // globals
  phet.joist.elapsedTime = 0; // in milliseconds, use this in Tween.start for replicable playbacks

  // When the simulation is going to be used to play back a recorded session, the simulation must be put into a special
  // mode in which it will only update the model + view based on the playback clock events rather than the system clock.
  // This must be set before the simulation is launched in order to ensure that no errant stepSimulation steps are called
  // before the playback events begin.  This value is overridden for playback by TPhETIO.
  // @public (phet-io)
  phet.joist.playbackModeEnabledProperty = new BooleanProperty( false );

  /**
   * Main Sim constructor
   * @param {string} name - the name of the simulation, to be displayed in the navbar and homescreen
   * @param {Screen[]} screens - the screens for the sim
   * @param {Object} [options] - see below for options
   * @constructor
   */
  function Sim( name, screens, options ) {

    var self = this;

    window.phetSplashScreenDownloadComplete();

    // playbackModeEnabledProperty cannot be changed after Sim construction has begun, hence this listener is added before
    // anything else is done, see https://github.com/phetsims/phet-io/issues/1146
    phet.joist.playbackModeEnabledProperty.lazyLink( function( playbackModeEnabled ) {
      throw new Error( 'playbackModeEnabledProperty cannot be changed after Sim construction has begun' );
    } );

    var tandem = Tandem.createRootTandem();
    var simTandem = tandem.createTandem( 'sim' );

    // @public (phet-io)
    this.tandem = tandem;

    // @public (phet-io) Emitter for PhET-iO data stream to describe the startup sequence
    this.startedSimConstructorEmitter = new Emitter();

    // @public (phet-io) Emitter for PhET-iO data stream to describe the startup sequence
    this.endedSimConstructionEmitter = new Emitter();

    // @public Emitter that indicates when the sim resized
    this.resizedEmitter = new Emitter();

    // @public Emitter that indicates when a frame starts
    this.frameStartedEmitter = new Emitter();

    // @public Emitter that indicates when a frame ends
    // phetioEmitData is false because we only want this manually wired for phetio event recording.
    this.frameEndedEmitter = new Emitter( {
      tandem: simTandem.createTandem( 'frameEndedEmitter' ),
      phetioArgumentTypes: [ TNumber( { units: 'seconds' } ) ],
      phetioEmitData: false // An adapter in phetio will create input events when recording for playback.
      // If we are not recording for visual playback, then we omit these from the data stream so that we don't get spammed with dt's.
    } );

    // The screens to be included, and their order, may be specified via a query parameter.
    // For documentation, see the schema for phet.chipper.queryParameters.screens in initialize-globals.js.
    // Do this before setting options.showHomeScreen, since no home screen should be shown if we have 1 screen.
    if ( QueryStringMachine.containsKey( 'screens' ) ) {
      var newScreens = [];
      phet.chipper.queryParameters.screens.forEach( function( userIndex ) {
        var screenIndex = userIndex - 1; // screens query parameter is 1-based
        if ( screenIndex < 0 || screenIndex > screens.length - 1 ) {
          throw new Error( 'invalid screen index: ' + userIndex );
        }
        newScreens.push( screens[ screenIndex ] );
      } );
      screens = newScreens;
    }

    options = _.extend( {

      // whether to show the home screen, or go immediately to the screen indicated by screenIndex
      showHomeScreen: ( screens.length > 1 ) && phet.chipper.queryParameters.showHomeScreen,

      // index of the screen that will be selected at startup (the query parameter is 1-based)
      screenIndex: phet.chipper.queryParameters.screenIndex - 1,

      // credits, see AboutDialog for format
      credits: {},

      // a {Node} placed into the Options dialog (if available)
      optionsNode: null,

      // a {Node} placed onto the home screen (if available)
      homeScreenWarningNode: null,

      // if true, records the scenery input events and sends them to a server that can store them
      recordInputEventLog: false,

      // when playing back a recorded scenery input event log, use the specified filename.  Please see getEventLogName for more
      inputEventLogName: undefined,

      // TODO https://github.com/phetsims/energy-skate-park-basics/issues/370
      // this function is currently (9-5-2014) specific to Energy Skate Park: Basics, which shows Save/Load buttons in
      // the PhET menu.  This interface is not very finalized and will probably be changed for future versions,
      // so don't rely on it.
      showSaveAndLoad: false,

      // If true, there will be a border shown around the home screen icons.  Use this option if the home screen icons
      // have the same color as the background, as in Color Vision.
      showSmallHomeScreenIconFrame: false,

      // Whether accessibility features are enabled or not.  Use this option to render the Parallel DOM for
      // keyboard navigation and screen reader based auditory descriptions.
      accessibility: phet.chipper.queryParameters.accessibility,

      // a {Node} placed into the keyboard help dialog that can be opened from the navigation bar
      keyboardHelpNode: null,

      // the default renderer for the rootNode, see #221, #184 and https://github.com/phetsims/molarity/issues/24
      rootRenderer: platform.edge ? 'canvas' : 'svg'
    }, options );

    // @private - store this for access from prototype functions, assumes that it won't be changed later
    this.options = options;

    // override rootRenderer using query parameter, see #221 and #184
    options.rootRenderer = phet.chipper.queryParameters.rootRenderer || options.rootRenderer;

    // @public (joist-internal) - True if the home screen is showing
    this.showHomeScreenProperty = new Property( options.showHomeScreen, {
      tandem: tandem.createTandem( 'sim.showHomeScreenProperty' ),
      phetioValueType: TBoolean
    } );

    // @public (joist-internal) - The selected screen's index
    this.screenIndexProperty = new Property( options.screenIndex, {
      tandem: tandem.createTandem( 'sim.screenIndexProperty' ),
      phetioValueType: TNumber( { values: _.range( 0, screens.length ) } )
    } );

    // @public
    // When the sim is active, scenery processes inputs and stepSimulation(dt) runs from the system clock.
    //
    // Set to false for when the sim will be paused.  If the sim has playbackModeEnabledProperty set to true, the activeProperty will
    // automatically be set to false so the timing and inputs can be controlled by the playback engine
    this.activeProperty = new Property( !phet.joist.playbackModeEnabledProperty.value, {
      tandem: tandem.createTandem( 'sim.activeProperty' ),
      phetioValueType: TBoolean
    } );

    // @public (read-only) - property that indicates whether the browser tab containing the simulation is currently visible
    this.browserTabVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'browserTabVisibleProperty' ),
      phetioValueType: TBoolean,
      phetioInstanceDocumentation: 'this Property is read-only, do not attempt to set its value'
    } );

    // set the state of the property that indicates if the browser tab is visible
    document.addEventListener( 'visibilitychange', function() {
      self.browserTabVisibleProperty.set( document.visibilityState === 'visible' );
    }, false );

    // @public (joist-internal, read-only) - how the home screen and navbar are scaled
    this.scaleProperty = new Property( 1 );

    // @public (joist-internal, read-only) - global bounds for the entire simulation
    this.boundsProperty = new Property( null );

    // @public (joist-internal, read-only) - global bounds for the screen-specific part (excludes the navigation bar)
    this.screenBoundsProperty = new Property( null );

    // @public (joist-internal, read-only) - {Screen|null} - The current screen, or null if showing the home screen
    this.currentScreenProperty = new Property( null );

    // Many other components use addInstance at the end of their constructor but in this case we must register early
    // to (a) enable the SimIFrameAPI as soon as possible and (b) to enable subsequent component registrations,
    // which require the sim to be registered
    simTandem.addInstance( this, TSim );

    // @public
    this.lookAndFeel = new LookAndFeel();

    assert && assert( window.phet.joist.launchCalled, 'Sim must be launched using SimLauncher, ' +
                                                      'see https://github.com/phetsims/joist/issues/142' );

    // @private
    this.destroyed = false;

    // @public ( joist-internal, read-only )
    this.accessible = options.accessibility;

    // @public ( joist-internal, read-only )
    this.keyboardHelpNode = options.keyboardHelpNode;

    assert && assert( !window.phet.joist.sim, 'Only supports one sim at a time' );
    window.phet.joist.sim = self;

    // Make ScreenshotGenerator available globally so it can be used in preload files such as PhET-iO.
    window.phet.joist.ScreenshotGenerator = ScreenshotGenerator;

    this.name = name;                   // @public (joist-internal)
    this.version = packageJSON.version; // @public (joist-internal)
    this.credits = options.credits;     // @public (joist-internal)

    // @private - number of animation frames that have occurred
    this.frameCounter = 0;

    // @private {boolean} - Whether the window has resized since our last updateDisplay()
    this.resizePending = true;

    // used to store input events and requestAnimationFrame cycles
    this.inputEventLog = [];                 // @public (joist-internal)
    this.inputEventBounds = Bounds2.NOTHING; // @public (joist-internal)

    // @public - Make our locale available
    this.locale = phet.chipper.locale || 'en';

    // If the locale query parameter was specified, then we may be running the all.html file, so adjust the title.
    // See https://github.com/phetsims/chipper/issues/510
    if ( QueryStringMachine.containsKey( 'locale' ) ) {
      $( 'title' ).html( name );
    }

    if ( phet.chipper.queryParameters.recordInputEventLog ) {
      // enables recording of Scenery's input events, request animation frames, and dt's so the sim can be played back
      options.recordInputEventLog = true;
      options.inputEventLogName = phet.chipper.queryParameters.recordInputEventLog;
    }

    if ( phet.chipper.queryParameters.playbackInputEventLog ) {
      // instead of loading like normal, download a previously-recorded event sequence and play it back (unique to the browser and window size)
      options.playbackInputEventLog = true;
      options.inputEventLogName = phet.chipper.queryParameters.playbackInputEventLog;
    }

    // override window.open with a semi-API-compatible function, so fuzzing doesn't open new windows.
    if ( phet.chipper.queryParameters.fuzzMouse ) {
      window.open = function() {
        return {
          focus: function() {},
          blur: function() {}
        };
      };
    }

    this.startedSimConstructorEmitter.emit1( {
      repoName: packageJSON.name,
      simName: this.name,
      simVersion: this.version,
      url: window.location.href,
      randomSeed: window.phet.chipper.randomSeed
    } );

    var $body = $( 'body' );

    // prevent scrollbars
    $body.css( 'padding', '0' ).css( 'margin', '0' ).css( 'overflow', 'hidden' );

    // set `user-select: none` on the aria-live container to prevent iOS text selection issue, see
    // https://github.com/phetsims/scenery/issues/1006
    var ariaLiveContainer = document.getElementById( 'aria-live-elements' );
    if ( ariaLiveContainer ) {
      ariaLiveContainer.style[ Features.userSelect ] = 'none';
    }

    // check to see if the sim div already exists in the DOM under the body. This is the case for https://github.com/phetsims/scenery/issues/174 (iOS offline reading list)
    if ( document.getElementById( 'sim' ) && document.getElementById( 'sim' ).parentNode === document.body ) {
      document.body.removeChild( document.getElementById( 'sim' ) );
    }

    // Prevents selection cursor issues in Safari, see https://github.com/phetsims/scenery/issues/476
    document.onselectstart = function() {
      return false;
    };

    // @public
    this.rootNode = new Node( { renderer: options.rootRenderer } );

    // When the sim becomes inactive, interrupt any currently active input listeners, see https://github.com/phetsims/scenery/issues/619.
    this.activeProperty.lazyLink( function( active ) {
      if ( !active ) {
        self.rootNode.interruptSubtreeInput();
      }
    } );

    // @private
    this.display = new Display( self.rootNode, {
      // prevent overflow that can cause iOS bugginess, see https://github.com/phetsims/phet-io/issues/341
      allowSceneOverflow: false,

      // Indicate whether webgl is allowed to facilitate testing on non-webgl platforms, see https://github.com/phetsims/scenery/issues/289
      allowWebGL: phet.chipper.queryParameters.webgl,

      accessibility: options.accessibility,
      isApplication: false,

      assumeFullWindow: true // a bit faster if we can assume no coordinate translations are needed for the display.
    } );

    // When the sim is inactive, make it non-interactive, see https://github.com/phetsims/scenery/issues/414
    this.activeProperty.link( function( active ) {
      self.display.interactive = active;

      // The sim must remain inactive while playbackModeEnabledProperty is true
      if ( active ) {
        assert && assert( !phet.joist.playbackModeEnabledProperty.value, 'The sim must remain inactive while playbackModeEnabledProperty is true' );
      }
    } );

    var simDiv = self.display.domElement;
    simDiv.id = 'sim';
    document.body.appendChild( simDiv );

    // for preventing Safari from going to sleep - added to the simDiv instead of the body to prevent a VoiceOver bug
    // where the virtual cursor would spontaneously move when the div content changed, see
    // https://github.com/phetsims/joist/issues/140
    var heartbeatDiv = this.heartbeatDiv = document.createElement( 'div' );
    heartbeatDiv.style.opacity = 0;

    // Extra style (also used for accessibility) that makes it take up no visual layout space.
    // Without this, it could cause some layout issues. See https://github.com/phetsims/gravity-force-lab/issues/39
    heartbeatDiv.style.position = 'absolute';
    heartbeatDiv.style.left = '0';
    heartbeatDiv.style.top = '0';
    heartbeatDiv.style.width = '0';
    heartbeatDiv.style.height = '0';
    heartbeatDiv.style.clip = 'rect(0,0,0,0)';
    heartbeatDiv.setAttribute( 'aria-hidden', true ); // hide div from screen readers (a11y)
    simDiv.appendChild( heartbeatDiv );

    if ( phet.chipper.queryParameters.sceneryLog ) {
      this.display.scenery.enableLogging( phet.chipper.queryParameters.sceneryLog );
    }

    if ( phet.chipper.queryParameters.sceneryStringLog ) {
      this.display.scenery.switchLogToString();
    }

    this.display.initializeEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    window.phet.joist.rootNode = this.rootNode; // make the scene available for debugging
    window.phet.joist.display = this.display; // make the display available for debugging

    // Pass through query parameters to scenery for showing supplemental information
    self.display.setPointerDisplayVisible( phet.chipper.queryParameters.showPointers );
    self.display.setPointerAreaDisplayVisible( phet.chipper.queryParameters.showPointerAreas );
    self.display.setCanvasNodeBoundsVisible( phet.chipper.queryParameters.showCanvasNodeBounds );
    self.display.setFittedBlockBoundsVisible( phet.chipper.queryParameters.showFittedBlockBounds );

    function sleep( millis ) {
      var date = new Date();
      var curDate;
      do {
        curDate = new Date();
      } while ( curDate - date < millis );
    }

    /*
     * These are used to make sure our sims still behave properly with an artificially higher load (so we can test what happens
     * at 30fps, 5fps, etc). There tend to be bugs that only happen on less-powerful devices, and these functions facilitate
     * testing a sim for robustness, and allowing others to reproduce slow-behavior bugs.
     */
    window.phet.joist.makeEverythingSlow = function() {
      window.setInterval( function() { sleep( 64 ); }, 16 );
    };
    window.phet.joist.makeRandomSlowness = function() {
      window.setInterval( function() { sleep( Math.ceil( 100 + Math.random() * 200 ) ); }, Math.ceil( 100 + Math.random() * 200 ) );
    };

    // @public
    this.screens = screens;

    // Multi-screen sims get a home screen.
    if ( screens.length > 1 ) {
      this.homeScreen = new HomeScreen( this, tandem.createTandem( 'homeScreen' ), {
        warningNode: options.homeScreenWarningNode,
        showSmallHomeScreenIconFrame: options.showSmallHomeScreenIconFrame
      } );
      this.homeScreen.initializeModelAndView();
    }
    else {
      this.homeScreen = null;
    }

    // @public (joist-internal)
    this.navigationBar = new NavigationBar( this, screens, tandem.createTandem( 'navigationBar' ) );

    // @public (joist-internal)
    this.updateBackground = function() {
      self.lookAndFeel.backgroundColorProperty.value = self.currentScreenProperty.value ?
                                                       self.currentScreenProperty.value.backgroundColorProperty.value :
                                                       self.homeScreen.backgroundColorProperty.value;
    };

    this.lookAndFeel.backgroundColorProperty.link( function( backgroundColor ) {
      self.display.backgroundColor = backgroundColor;
    } );

    Property.multilink( [ this.showHomeScreenProperty, this.screenIndexProperty ],
      function( showHomeScreen, screenIndex ) {
        self.currentScreenProperty.value = ( showHomeScreen && self.homeScreen ) ? null : screens[ screenIndex ];
        self.updateBackground();
      } );

    // When the user switches screens, interrupt the input on the previous screen.
    // See https://github.com/phetsims/scenery/issues/218
    this.currentScreenProperty.lazyLink( function( newScreen, oldScreen ) {
      if ( oldScreen === null ) {
        self.homeScreen.view.interruptSubtreeInput();
      }
      else {
        oldScreen.view.interruptSubtreeInput();
      }
    } );

    // Third party support
    phet.chipper.queryParameters.legendsOfLearning && new LegendsOfLearningSupport( this ).start();
  }

  joist.register( 'Sim', Sim );

  return inherit( Object, Sim, {
    finishInit: function( screens, tandem ) {
      var self = this;

      // ModuleIndex should always be defined.  On startup screenIndex=1 to highlight the 1st screen.
      // When moving from a screen to the homescreen, the previous screen should be highlighted

      if ( this.homeScreen ) {
        this.rootNode.addChild( this.homeScreen.view );
      }
      _.each( screens, function( screen ) {
        screen.view.layerSplit = true;
        self.rootNode.addChild( screen.view );
      } );
      this.rootNode.addChild( this.navigationBar );

      if ( this.homeScreen ) {

        // Once both the navbar and homescreen have been added, link the PhET button positions together.
        // See https://github.com/phetsims/joist/issues/304.
        PhetButton.linkPhetButtonTransform( this.homeScreen, this.navigationBar, this.rootNode );
      }

      Property.multilink( [ this.showHomeScreenProperty, this.screenIndexProperty ],
        function( showHomeScreen, screenIndex ) {

          if ( self.homeScreen ) {

            // You can't set the active property if the screen is visible, so order matters here
            if ( showHomeScreen ) {
              self.homeScreen.activeProperty.set( true );
              self.homeScreen.view.setVisible( true );
            }
            else {
              self.homeScreen.view.setVisible( false );
              self.homeScreen.activeProperty.set( false );
            }
          }

          // Make the selected screen visible and active, other screens invisible and inactive.
          // screen.isActiveProperty should change only while the screen is invisible.
          // See https://github.com/phetsims/joist/issues/418.
          for ( var i = 0; i < screens.length; i++ ) {
            var screen = screens[ i ];
            var visible = ( !showHomeScreen && screenIndex === i );
            if ( visible ) {
              screen.activeProperty.set( visible );
            }
            screen.view.setVisible( visible );
            if ( !visible ) {
              screen.activeProperty.set( visible );
            }
          }

          self.navigationBar.setVisible( !showHomeScreen );
          self.updateBackground();
        } );

      // layer for popups, dialogs, and their backgrounds and barriers
      this.topLayer = new Node();
      this.rootNode.addChild( this.topLayer );

      // @private list of nodes that are "modal" and hence block input with the barrierRectangle.  Used by modal dialogs
      // and the PhetMenu
      this.modalNodeStack = new ObservableArray( {
        // tandem: tandem.createTandem( 'modalNodeStack' ),
        // phetioValueType: TNode
      } ); // {Node} with node.hide()

      // @public (joist-internal) Semi-transparent black barrier used to block input events when a dialog (or other popup)
      // is present, and fade out the background.
      this.barrierRectangle = new BarrierRectangle(
        this.modalNodeStack,
        {
          fill: 'rgba(0,0,0,0.3)',
          pickable: true,
          tandem: tandem.createTandem( 'sim.barrierRectangle' )
        } );

      this.topLayer.addChild( this.barrierRectangle );


      // Fit to the window and render the initial scene
      // Can't synchronously do this in Firefox, see https://github.com/phetsims/vegas/issues/55 and
      // https://bugzilla.mozilla.org/show_bug.cgi?id=840412.
      var resizeListener = function() {
        // Don't resize on window size changes if we are playing back input events.
        // See https://github.com/phetsims/joist/issues/37
        if ( !phet.joist.playbackModeEnabledProperty.value ) {
          self.resizePending = true;
        }
      };
      $( window ).resize( resizeListener );
      window.addEventListener( 'resize', resizeListener );
      window.addEventListener( 'orientationchange', resizeListener );
      window.visualViewport && window.visualViewport.addEventListener( 'resize', resizeListener );
      this.resizeToWindow();

      // Kick off checking for updates, if that is enabled
      UpdateCheck.check();

      // @public (joist-internal) - Keep track of the previous time for computing dt, and initially signify that time
      // hasn't been recorded yet.
      this.lastTime = -1;

      // @public (joist-internal)
      // Bind the animation loop so it can be called from requestAnimationFrame with the right this.
      this.boundRunAnimationLoop = this.runAnimationLoop.bind( this );
    },

    /*
     * Adds a popup in the global coordinate frame, and optionally displays a semi-transparent black input barrier behind it.
     * Use hidePopup() to remove it.
     * @param {Node} node - Should have node.hide() implemented to hide the popup (should subsequently call
     *                      sim.hidePopup()).
     * @param {boolean} isModal - Whether to display the semi-transparent black input barrier behind it.
     * @public
     */
    showPopup: function( node, isModal ) {
      assert && assert( node );
      assert && assert( !!node.hide, 'Missing node.hide() for showPopup' );
      assert && assert( !this.topLayer.hasChild( node ), 'Popup already shown' );

      if ( isModal ) {
        this.modalNodeStack.push( node );
      }
      this.topLayer.addChild( node );

    },

    /*
     * Hides a popup that was previously displayed with showPopup()
     * @param {Node} node
     * @param {boolean} isModal - Whether the previous popup was modal (or not)
     * @public
     */
    hidePopup: function( node, isModal ) {
      assert && assert( node && this.modalNodeStack.contains( node ) );
      assert && assert( this.topLayer.hasChild( node ), 'Popup was not shown' );

      if ( isModal ) {
        this.modalNodeStack.remove( node );
      }
      this.topLayer.removeChild( node );

    },

    /**
     * @public (joist-internal)
     */
    resizeToWindow: function() {
      this.resizePending = false;

      this.resize( window.innerWidth, window.innerHeight );
    },

    // @public (joist-internal, phet-io)
    resize: function( width, height ) {
      var self = this;

      var scale = Math.min( width / HomeScreenView.LAYOUT_BOUNDS.width, height / HomeScreenView.LAYOUT_BOUNDS.height );

      // 40 px high on iPad Mobile Safari
      var navBarHeight = scale * NavigationBar.NAVIGATION_BAR_SIZE.height;
      self.navigationBar.layout( scale, width, navBarHeight );
      self.navigationBar.y = height - navBarHeight;
      self.display.setSize( new Dimension2( width, height ) );

      var screenHeight = height - self.navigationBar.height;

      // Layout each of the screens
      _.each( self.screens, function( m ) {
        m.view.layout( width, screenHeight );
      } );

      // Resize the layer with all of the dialogs, etc.
      self.topLayer.setScaleMagnitude( scale );

      self.homeScreen && self.homeScreen.view.layout( width, height );

      // Startup can give spurious resizes (seen on ipad), so defer to the animation loop for painting

      // Fixes problems where the div would be way off center on iOS7
      if ( platform.mobileSafari ) {
        window.scrollTo( 0, 0 );
      }

      // update our scale and bounds properties after other changes (so listeners can be fired after screens are resized)
      this.scaleProperty.value = scale;
      this.boundsProperty.value = new Bounds2( 0, 0, width, height );
      this.screenBoundsProperty.value = new Bounds2( 0, 0, width, screenHeight );

      // Signify that the sim has been resized.
      // {Bounds2} bounds - the size of the window.innerWidth and window.innerHeight, which depends on the scale
      // {Bounds2} screenBounds - subtracts off the size of the navbar from the height
      // {number} scale - the overall scaling factor for elements in the view
      this.resizedEmitter.emit3( this.boundsProperty.value, this.screenBoundsProperty.value, this.scaleProperty.value );
    },

    // @public (joist-internal)
    start: function() {

      var self = this;

      // In order to animate the loading progress bar, we must schedule work with setTimeout
      // This array of {function} is the work that must be completed to launch the sim.
      var workItems = [];

      var screens = this.screens;

      // Schedule instantiation of the screens
      screens.forEach( function initializeScreen( screen ) {
        workItems.push( function() {
          screen.backgroundColorProperty.link( self.updateBackground );
          screen.initializeModel();
        } );
        workItems.push( function() {
          screen.initializeView();
        } );
      } );

      // loop to run startup items asynchronously so the DOM can be updated to show animation on the progress bar
      var runItem = function( i ) {
        setTimeout(
          function() {
            workItems[ i ]();
            // Move the progress ahead by one so we show the full progress bar for a moment before the sim starts up

            var progress = DotUtil.linear( 0, workItems.length - 1, 0.25, 1.0, i );

            // Support iOS Reading Mode, which saves a DOM snapshot after the progressBarForeground has already been
            // removed from the document, see https://github.com/phetsims/joist/issues/389
            if ( document.getElementById( 'progressBarForeground' ) ) {

              // Grow the progress bar foreground to the right based on the progress so far.
              document.getElementById( 'progressBarForeground' ).setAttribute( 'width', (progress * PROGRESS_BAR_WIDTH) + '' );
            }
            if ( i + 1 < workItems.length ) {
              runItem( i + 1 );
            }
            else {

              setTimeout( function() {
                self.finishInit( screens, self.tandem );

                // Make sure requestAnimationFrame is defined
                Util.polyfillRequestAnimationFrame();

                // Option for profiling
                // if true, prints screen initialization time (total, model, view) to the console and displays
                // profiling information on the screen
                if ( phet.chipper.queryParameters.profiler ) {
                  Profiler.start( self );
                }

                // place the rAF *before* the render() to assure as close to 60fps with the setTimeout fallback.
                // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
                // Launch the bound version so it can easily be swapped out for debugging.
                self.boundRunAnimationLoop();

                // Communicate sim load (successfully) to joist/tests/test-sims.html
                if ( phet.chipper.queryParameters.postMessageOnLoad ) {
                  window.parent && window.parent.postMessage( JSON.stringify( {
                    type: 'load',
                    url: window.location.href
                  } ), '*' );
                }

                // After the application is ready to go, remove the splash screen and progress bar
                window.phetSplashScreen.dispose();

                // Signify the end of simulation startup.  Used by PhET-iO.
                self.endedSimConstructionEmitter.emit();

              }, 25 ); // pause for a few milliseconds with the progress bar filled in before going to the home screen
            }
          },
          // The following sets the amount of delay between each work item to make it easier to see the changes to the
          // progress bar.  A total value is divided by the number of work items.  This makes it possible to see the
          // progress bar when few work items exist, such as for a single screen sim, but allows things to move
          // reasonably quickly when more work items exist, such as for a four-screen sim.
          30 / workItems.length
        );
      };

      runItem( 0 );
    },

    // Destroy a sim so that it will no longer consume any resources. Formerly used in Smorgasbord.  May not be used by
    // anything else at the moment.
    // @public (joist-internal)
    destroy: function() {
      this.destroyed = true;
      var simDiv = this.display.domElement;
      simDiv.parentNode && simDiv.parentNode.removeChild( simDiv );
    },

    // @private - Bound to this.boundRunAnimationLoop so it can be run in window.requestAnimationFrame
    runAnimationLoop: function() {

      if ( !this.destroyed ) {
        window.requestAnimationFrame( this.boundRunAnimationLoop );
      }

      // Setting the activeProperty to false pauses the sim and also enables optional support for playback back recorded
      // events (if playbackModeEnabledProperty) is true
      if ( this.activeProperty.value ) {

        this.stepOneFrame();
      }
    },

    // @private - run a single frame including model, view and display updates
    stepOneFrame: function() {

      // Compute the elapsed time since the last frame, or guess 1/60th of a second if it is the first frame
      var time = Date.now();
      var elapsedTimeMilliseconds = (this.lastTime === -1) ? (1000.0 / 60.0) : (time - this.lastTime);
      this.lastTime = time;

      // Convert to seconds
      var dt = elapsedTimeMilliseconds / 1000.0;

      // Don't run the simulation on steps back in time (see https://github.com/phetsims/joist/issues/409)
      if ( dt >= 0 ) {
        this.stepSimulation( dt );
      }
    },

    /**
     * Returns the selected screen, or null if the home screen is showing.
     * @returns {Screen|null}
     * @private
     */
    getSelectedScreen: function() {
      return this.showHomeScreenProperty.value ? null : this.screens[ this.screenIndexProperty.value ];
    },

    /**
     * Update the simulation model, view, scenery display with an elapsed time of dt.
     * @param {number} dt in seconds
     * @public (phet-io)
     */
    stepSimulation: function( dt ) {

      this.frameStartedEmitter.emit();

      // increment this before we can have an exception thrown, to see if we are missing frames
      this.frameCounter++;

      phetAllocation && phetAllocation( 'loop' );

      // prevent Safari from going to sleep, see https://github.com/phetsims/joist/issues/140
      if ( this.frameCounter % 1000 === 0 ) {
        this.heartbeatDiv.innerHTML = Math.random();
      }

      if ( this.resizePending ) {
        this.resizeToWindow();
      }

      // fire or synthesize input events
      if ( phet.chipper.queryParameters.fuzzMouse ) {
        this.display.fuzzMouseEvents( phet.chipper.queryParameters.fuzzRate );
      }

      // If the user is on the home screen, we won't have a Screen that we'll want to step.  This must be done after
      // fuzz mouse, because fuzzing could change the selected screen, see #130
      var screen = this.getSelectedScreen();

      // cap dt based on the current screen, see https://github.com/phetsims/joist/issues/130
      if ( screen && screen.maxDT ) {
        dt = Math.min( dt, screen.maxDT );
      }

      // TODO: we are /1000 just to *1000?  Seems wasteful and like opportunity for error. See https://github.com/phetsims/joist/issues/387
      // Store the elapsed time in milliseconds for usage by Tween clients
      phet.joist.elapsedTime = phet.joist.elapsedTime + dt * 1000;

      // Timer step before model/view steps, see https://github.com/phetsims/joist/issues/401
      Timer.step( dt );

      // If the DT is 0, we will skip the model step (see https://github.com/phetsims/joist/issues/171)
      if ( screen && screen.model.step && dt ) {
        screen.model.step( dt );
      }

      // If using the TWEEN animation library, then update all of the tweens (if any) before rendering the scene.
      // Update the tweens after the model is updated but before the view step.
      // See https://github.com/phetsims/joist/issues/401.
      //TODO https://github.com/phetsims/joist/issues/404 run TWEENs for the selected screen only
      if ( window.TWEEN ) {
        window.TWEEN.update( phet.joist.elapsedTime );
      }

      // View step is the last thing before updateDisplay(), so we can do paint updates there.
      // See https://github.com/phetsims/joist/issues/401.
      if ( screen && screen.view.step ) {
        screen.view.step( dt );
      }

      this.display.updateDisplay();

      this.frameEndedEmitter.emit1( dt );
    }
  } );
} );