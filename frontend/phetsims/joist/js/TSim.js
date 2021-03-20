// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var joist = require( 'JOIST/joist' );
  var SimIFrameAPI = require( 'ifphetio!PHET_IO/SimIFrameAPI' );
  var TFunctionWrapper = require( 'ifphetio!PHET_IO/types/TFunctionWrapper' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var toEventOnEmit = require( 'ifphetio!PHET_IO/toEventOnEmit' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

  // constants
  // The token for the event that occurs when the simulation constructor completes. This is hard-coded in many places
  // such as th playback wrapper, so should not be changed lightly!
  var SIM_STARTED = 'simStarted';

  /**
   * Wrapper type for phet/joist's Sim class.
   * @param sim
   * @param phetioID
   * @constructor
   */
  function TSim( sim, phetioID ) {
    assertInstanceOf( sim, phet.joist.Sim );
    TObject.call( this, sim, phetioID );

    // startedSimConstructorEmitter is called in the constructor of the sim, and endedSimConstructionEmitter is called
    // once all of the screens have been fully initialized, hence construction not constructor.
    // The simStarted event is guaranteed to be a top-level event, not nested under other events.
    toEventOnEmit( sim.startedSimConstructorEmitter, sim.endedSimConstructionEmitter, 'model', phetioID, this.constructor, SIM_STARTED,
      function( value ) {
        var simData = {
          repoName: value.repoName,
          simName: value.simName,
          simVersion: value.simVersion,
          simURL: value.url,
          userAgent: window.navigator.userAgent,
          randomSeed: value.randomSeed,
          wrapperMetadata: window.simStartedMetadata,
          provider: 'PhET Interactive Simulations, University of Colorado Boulder' // See #137
        };

        // Delete this global object once it has been used with this emitted event.
        delete window.simStartedMetadata;
        return simData;
      } );

    // Store a reference to the sim so that subsequent calls will be simpler.  PhET-iO only works with a single sim.
    phetio.sim = sim;
    sim.endedSimConstructionEmitter.addListener( function() {

      // TODO: Can these be coalesced?  See https://github.com/phetsims/joist/issues/412
      SimIFrameAPI.triggerSimInitialized();
      phetio.simulationStarted();
    } );
  }

  phetioInherit( TObject, 'TSim', TSim, {

    disableRequestAnimationFrame: {
      returnType: TVoid,
      parameterTypes: [],
      implementation: function() {
        this.instance.disableRequestAnimationFrame();
      },
      documentation: 'Prevents the simulation from animating/updating'
    },

    addEventListener: {
      returnType: TVoid,
      parameterTypes: [ TString, TFunctionWrapper( TVoid, [ TString, TFunctionWrapper( TVoid, [] ) ] ) ],
      implementation: function( eventName, listener ) {
        this.instance.onStatic( eventName, listener );
      },
      documentation: 'Add an event listener to the sim instance'
    },

    getScreenshotDataURL: {
      returnType: TString,
      parameterTypes: [],
      implementation: function() {
        return window.phet.joist.ScreenshotGenerator.generateScreenshot( this.instance );
      },
      documentation: 'Gets a base64 representation of a screenshot of the simulation as a data url'
    }
  }, {
    documentation: 'The type for the simulation instance',
    events: [
      SIM_STARTED
    ]
  } );


  joist.register( 'TSim', TSim );

  return TSim;
} );

