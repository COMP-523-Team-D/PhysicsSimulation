// Copyright 2015, University of Colorado Boulder

/**
 * Shows a fixed-size dialog that displays the current update status
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'JOIST/Dialog' );
  var Timer = require( 'PHET_CORE/Timer' );
  var UpdateNodes = require( 'JOIST/UpdateNodes' );
  var UpdateCheck = require( 'JOIST/UpdateCheck' );
  var joist = require( 'JOIST/joist' );

  /**
   * @param {PhETButton} phetButton - PhET button in the navigation bar, receives focus when this dialog is closed
   */
  function UpdateDialog( phetButton ) {
    assert && assert( UpdateCheck.areUpdatesChecked,
      'Updates need to be checked for UpdateDialog to be created' );

    var self = this;

    var positionOptions = { centerX: 0, centerY: 0, big: true };
    var checkingNode = UpdateNodes.createCheckingNode( positionOptions );
    var upToDateNode = UpdateNodes.createUpToDateNode( positionOptions );
    var outOfDateNode = new Node();
    var offlineNode = UpdateNodes.createOfflineNode( positionOptions );

    function updateOutOfDateNode() {
      // fallback size placeholder for version
      var latestVersionString = UpdateCheck.latestVersion ? UpdateCheck.latestVersion.toString() : 'x.x.xx';
      var ourVersionString = UpdateCheck.ourVersion.toString();

      // a11y - dialog content contained in parent div so ARIA roles can be applied to all children
      outOfDateNode.tagName = 'div';

      outOfDateNode.children = [
        UpdateNodes.createOutOfDateDialogNode( self, ourVersionString, latestVersionString, positionOptions )
      ];
    }

    updateOutOfDateNode();

    // @private - Listener that should be called every frame where we are shown, with {number} dt as a single parameter.
    this.updateStepListener = checkingNode.stepListener;

    // Listener that should be called whenever our update state changes (while we are displayed)
    this.updateVisibilityListener = function( state ) {
      if ( state === 'out-of-date' ) {
        updateOutOfDateNode();
      }

      checkingNode.visible = state === 'checking';
      upToDateNode.visible = state === 'up-to-date';
      outOfDateNode.visible = state === 'out-of-date';
      offlineNode.visible = state === 'offline';
      
      // a11y - update visibility of update nodes for screen readers by adding/removing content from the DOM, 
      // necessary because screen readers will read hidden content in a Dialog
      checkingNode.accessibleContentDisplayed = checkingNode.visible;
      upToDateNode.accessibleContentDisplayed = upToDateNode.visible;
      outOfDateNode.accessibleContentDisplayed = outOfDateNode.visible;
      offlineNode.accessibleContentDisplayed = offlineNode.visible;
    };

    var content = new Node( {
      children: [
        checkingNode,
        upToDateNode,
        outOfDateNode,
        offlineNode
      ],

      // a11y
      tagName: 'div'
    } );

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: true,

      // margins large enough to make space for close button
      xMargin: 30,
      yMargin: 30,

      // a11y
      focusOnCloseNode: phetButton
    } );

    // close it on a click
    var buttonListener = new ButtonListener( {
      fire: self.hide.bind( self )
    } );
    this.addInputListener( buttonListener );

    // @private - to be called by dispose()
    this.disposeUpdateDialog = function() {
      self.removeInputListener( buttonListener );
    };
  }

  joist.register( 'UpdateDialog', UpdateDialog );

  return inherit( Dialog, UpdateDialog, {

    /**
     * Show the UpdateDialog, registering listeners that should only be called while
     * the dialog is shown.
     * @public (joist-internal)
     */
    show: function() {
      if ( UpdateCheck.areUpdatesChecked ) {
        UpdateCheck.resetTimeout();

        // Fire off a new update check if we were marked as offline or unchecked before, and we handle updates.
        if ( UpdateCheck.stateProperty.value === 'offline' || UpdateCheck.stateProperty === 'unchecked' ) {
          UpdateCheck.check();
        }

        // Hook up our spinner listener when we're shown
        Timer.addStepListener( this.updateStepListener );

        // Hook up our visibility listener
        UpdateCheck.stateProperty.link( this.updateVisibilityListener );
      }

      Dialog.prototype.show.call( this );
    },

    /**
     * Remove listeners that should only be called when the Dialog is shown.
     * @public (joist-internal)
     */
    hide: function() {
      if ( this.isShowing ) {
        Dialog.prototype.hide.call( this );

        if ( UpdateCheck.areUpdatesChecked ) {

          // Disconnect our visibility listener
          UpdateCheck.stateProperty.unlink( this.updateVisibilityListener );

          // Disconnect our spinner listener when we're hidden
          Timer.removeStepListener( this.updateStepListener );
        }
      }
    },

    /**
     * Dispose the UpdateDialog so that it is eligible for garbage collection.
     * @public
     */
    dispose: function() {
      this.disposeUpdateDialog();
      Dialog.prototype.dispose.call( this );
    }
  } );
} );
