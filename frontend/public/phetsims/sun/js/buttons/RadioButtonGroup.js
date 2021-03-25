// Copyright 2014-2015, University of Colorado Boulder

/**
 * Radio buttons. See ButtonsView for example usage.
 *
 * This type creates a group of radio buttons in either a horizontal or vertical formation.
 * Each button inherits from RectangularButtonView, and can take a Scenery Node as its content.
 * A typical use case is when you want to have different modes of a view to select from. Typically,
 * RadioButtonGroup radio buttons display some kind of icon or image, but that is not mandatory.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ColorConstants = require( 'SUN/ColorConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroupAppearance = require( 'SUN/buttons/RadioButtonGroupAppearance' );
  var RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var sun = require( 'SUN/sun' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var BUTTON_CONTENT_X_ALIGN_VALUES = [ 'center', 'left', 'right' ];
  var BUTTON_CONTENT_Y_ALIGN_VALUES = [ 'center', 'top', 'bottom' ];

  // a11y - integer to allow distinct name attributes for each set of RadioButtonGroupMembers, increments with each
  // instantiation of RadioButtonGroup
  var instanceCount = 0;

  /**
   * RadioButtonGroup constructor.
   *
   * @param {Property} property
   * @param {Array} contentArray an array of objects that have two keys each: value and node the node key holds a
   * scenery Node that is the content for a given radio button. the value key should hold the value that the property
   * takes on for the corresponding node to be selected. Optionally, these objects can have an attribute 'label', which
   * is a {Node} used to label the button.
   * @param {Object} [options]
   * @constructor
   */
  function RadioButtonGroup( property, contentArray, options ) {
    options = _.extend( {
      tandem: Tandem.tandemRequired(),

      // a11y
      tagName: 'fieldset'
    }, options );

    // increment instance count
    instanceCount++;

    assert && assert( !options.hasOwnProperty( 'children' ), 'Cannot pass in children to a RadioButtonGroup, ' +
                                                             'create siblings in the parent node instead' );

    // make sure every object in the content array has properties 'node' and 'value'
    assert && assert( _.every( contentArray, function( obj ) {
      return obj.hasOwnProperty( 'node' ) && obj.hasOwnProperty( 'value' );
    } ), 'contentArray must be an array of objects with properties "node" and "value"' );

    var i; // for loops

    // make sure that each value passed into the contentArray is unique
    var uniqueValues = [];
    for ( i = 0; i < contentArray.length; i++ ) {
      if ( uniqueValues.indexOf( contentArray[ i ].value ) < 0 ) {
        uniqueValues.push( contentArray[ i ].value );
      }
      else {
        throw new Error( 'Duplicate value: "' + contentArray[ i ].value + '" passed into RadioButtonGroup.js' );
      }
    }

    // make sure that the property passed in currently has a value from the contentArray
    if ( uniqueValues.indexOf( property.get() ) === -1 ) {
      throw new Error( 'The property passed in to RadioButtonGroup has an illegal value "' + property.get() +
                       '" that is not present in the contentArray' );
    }

    var defaultOptions = {

      // LayoutBox options (super class of RadioButtonGroup)
      spacing: 10,
      orientation: 'vertical',

      enabledProperty: new Property( true ), // whether or not the set of radio buttons as a whole is enabled

      // The fill for the rectangle behind the radio buttons.  Default color is bluish color, as in the other button library.
      baseColor: ColorConstants.LIGHT_BLUE,
      disabledBaseColor: ColorConstants.LIGHT_GRAY,

      // Opacity can be set separately for the buttons and button content.
      selectedButtonOpacity: 1,
      deselectedButtonOpacity: 0.6,
      selectedContentOpacity: 1,
      deselectedContentOpacity: 0.6,
      overButtonOpacity: 0.8,
      overContentOpacity: 0.8,

      selectedStroke: 'black',
      deselectedStroke: new Color( 50, 50, 50 ),
      selectedLineWidth: 1.5,
      deselectedLineWidth: 1,

      // The following options specify highlight behavior overrides, leave as null to get the default behavior
      // Note that highlighting applies only to deselected buttons
      overFill: null,
      overStroke: null,
      overLineWidth: null,

      // These margins are *within* each button
      buttonContentXMargin: 5,
      buttonContentYMargin: 5,

      // alignment of the content nodes *within* each button
      buttonContentXAlign: 'center', // {string} see BUTTON_CONTENT_X_ALIGN_VALUES
      buttonContentYAlign: 'center', // {string} see BUTTON_CONTENT_Y_ALIGN_VALUES

      // TouchArea expansion
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,

      // MouseArea expansion
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 0,

      //The radius for each button
      cornerRadius: 4,

      // How far from the button the text label is (only applies if labels are passed in)
      labelSpacing: 0,

      // Which side of the button the label will appear, options are 'top', 'bottom', 'left', 'right'
      // (only applies if labels are passed in)
      labelAlign: 'bottom',

      // The default appearances use the color values specified above, but other appearances could be specified for more
      // customized behavior.  Generally setting the color values above should be enough to specify the desired look.
      buttonAppearanceStrategy: RadioButtonGroupAppearance.defaultRadioButtonsAppearance,
      contentAppearanceStrategy: RadioButtonGroupAppearance.contentAppearanceStrategy
    };

    options = _.extend( _.clone( defaultOptions ), options );

    assert && assert( _.includes( BUTTON_CONTENT_X_ALIGN_VALUES, options.buttonContentXAlign ),
      'invalid buttonContentXAlign: ' + options.buttonContentXAlign );
    assert && assert( _.includes( BUTTON_CONTENT_Y_ALIGN_VALUES, options.buttonContentYAlign ),
      'invalid buttonContentYAlign: ' + options.buttonContentYAlign );

    // make a copy of the options to pass to individual buttons that includes all default options but not scenery options
    var buttonOptions = _.pick( options, _.keys( defaultOptions ) );

    // calculate the maximum width and height of the content so we can make all radio buttons the same size
    var widestContentWidth = _.maxBy( contentArray, function( content ) { return content.node.width; } ).node.width;
    var tallestContentHeight = _.maxBy( contentArray, function( content ) { return content.node.height; } ).node.height;

    // make sure all radio buttons are the same size and create the RadioButtons
    var buttons = [];
    var button;
    for ( i = 0; i < contentArray.length; i++ ) {

      assert && assert( !contentArray[ i ].hasOwnProperty( 'phetioValueType' ), 'phetioValueType should be provided by ' +
                                                                                'the property passed to the ' +
                                                                                'RadioButtonGroup constructor' );

      assert && assert( !contentArray[ i ].tandem, 'content arrays should not have tandem instances, they should use ' +
                                                   'tandemName instead' );

      if ( Tandem.validationEnabled() ) {
        assert && assert( contentArray[ i ].tandemName, 'In PhET-iO mode, radio button group members must have a provided tandem' );
      }

      var radioButton = new RadioButtonGroupMember( property, contentArray[ i ].value, _.extend( {
        content: contentArray[ i ].node,
        xMargin: options.buttonContentXMargin,
        yMargin: options.buttonContentYMargin,
        xAlign: options.buttonContentXAlign,
        yAlign: options.buttonContentYAlign,
        minWidth: widestContentWidth + 2 * options.buttonContentXMargin,
        minHeight: tallestContentHeight + 2 * options.buttonContentYMargin,

        // Pass through the tandem given the tandemName, but also support uninstrumented simulations
        tandem: options.tandem.createTandem( contentArray[ i ].tandemName || ('radioButtonGroupMember' + i) )
      }, buttonOptions ) );

      // a11y - so the browser and assistive technology recognizes that these buttons are in the same group
      radioButton.setAccessibleAttribute( 'name', 'radioButtonGroup' + instanceCount + 'Member' );

      // ensure the buttons don't resize when selected vs unselected by adding a rectangle with the max size
      var maxLineWidth = Math.max( options.selectedLineWidth, options.deselectedLineWidth );
      var maxButtonWidth = maxLineWidth + widestContentWidth + options.buttonContentXMargin * 2;
      var maxButtonHeight = maxLineWidth + tallestContentHeight + options.buttonContentYMargin * 2;
      var boundingRect = new Rectangle( 0, 0, maxButtonWidth, maxButtonHeight, {
        fill: 'rgba(0,0,0,0)',
        center: radioButton.center
      } );
      radioButton.addChild( boundingRect );

      // if a label is given, the button becomes a LayoutBox with the label and button
      if ( contentArray[ i ].label ) {
        var label = contentArray[ i ].label;
        var labelOrientation = ( options.labelAlign === 'bottom' || options.labelAlign === 'top' ) ? 'vertical' : 'horizontal';
        var labelChildren = ( options.labelAlign === 'left' || options.labelAlign === 'top' ) ? [ label, radioButton ] : [ radioButton, label ];
        button = new LayoutBox( {
          children: labelChildren,
          spacing: options.labelSpacing,
          orientation: labelOrientation
        } );

        var xDilation = options.touchAreaXDilation;
        var yDilation = options.touchAreaYDilation;

        // override the touch and mouse areas defined in RectangularButtonView
        // extra width is added to the SingleRadioButtons so they don't change size if the line width changes,
        // that is why lineWidth is subtracted from the width and height when calculating these new areas
        radioButton.touchArea = Shape.rectangle(
          -xDilation,
          -yDilation,
          button.width + 2 * xDilation - maxLineWidth,
          button.height + 2 * yDilation - maxLineWidth
        );

        xDilation = options.mouseAreaXDilation;
        yDilation = options.mouseAreaYDilation;
        radioButton.mouseArea = Shape.rectangle(
          -xDilation,
          -yDilation,
          button.width + 2 * xDilation - maxLineWidth,
          button.height + 2 * yDilation - maxLineWidth
        );

        // make sure the label mouse and touch areas don't block the expanded button touch and mouse areas
        label.pickable = false;

        // use the same content appearance strategy for the labels that is used for the button content
        options.contentAppearanceStrategy( label, radioButton.interactionStateProperty, options );
      }
      else {
        button = radioButton;
      }

      // a11y
      // set a dilated focus highlight around the button group member
      // if a label has been added, the highlight will surround both the label and button
      radioButton.setFocusHighlight( Shape.bounds( radioButton.mouseArea.bounds.dilated( 5 ) ) );

      buttons.push( button );
    }

    // @private
    this.enabledProperty = options.enabledProperty;

    // super call
    options.children = buttons;
    LayoutBox.call( this, options );
    var self = this;

    // When the entire RadioButtonGroup gets disabled, gray them out and make them unpickable (and vice versa)
    this.enabledProperty.link( function( isEnabled ) {
      self.pickable = isEnabled;

      for ( i = 0; i < contentArray.length; i++ ) {
        if ( buttons[ i ] instanceof LayoutBox ) {
          for ( var j = 0; j < 2; j++ ) {
            buttons[ i ].children[ j ].enabled = isEnabled;
          }
        }
        else {
          buttons[ i ].enabled = isEnabled;
        }
      }
    } );

    // make the unselected buttons pickable and have a pointer cursor
    property.link( function( value ) {
      if ( self.enabledProperty.get() ) {
        for ( i = 0; i < contentArray.length; i++ ) {
          if ( contentArray[ i ].value === value ) {
            buttons[ i ].pickable = false;
            buttons[ i ].cursor = null;
          }
          else {
            buttons[ i ].pickable = true;
            buttons[ i ].cursor = 'pointer';
          }
        }
      }
    } );
  }

  sun.register( 'RadioButtonGroup', RadioButtonGroup );

  return inherit( LayoutBox, RadioButtonGroup, {

    // @public
    dispose: function() {
      //TODO implement this, see sun#212
      LayoutBox.prototype.dispose.call( this );
    },

    // @public
    set enabled( value ) {
      assert && assert( typeof value === 'boolean', 'RadioButtonGroup.enabled must be a boolean value' );
      this.enabledProperty.set( value );
    },

    // @public
    get enabled() {
      return this.enabledProperty.get();
    }
  } );
} );
