// Copyright 2016, University of Colorado Boulder

/**
 * A key accumulator that collects user input for integer and floating point values, intended for use in conjunction
 * with the common-code keypad.
 *
 * @author Aadish Gupta
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractKeyAccumulator = require( 'SCENERY_PHET/keypad/AbstractKeyAccumulator' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var NEGATIVE_CHAR = '\u2212';
  var DECIMAL_CHAR = '.';

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NumberAccumulator( options ) {
    Tandem.indicateUninstrumentedCode();

    var self = this;
    options = _.extend( {
      maxDigitsRightOfMantissa: 0,
      maxDigits: 15
    }, options );

    AbstractKeyAccumulator.call( this, options );

    this.maxDigitsRightOfMantissa = options.maxDigitsRightOfMantissa; // @private
    this.maxDigits = options.maxDigits; // @private

    // @public (read-only) - string representation of the keys entered by the user
    this.stringProperty = new DerivedProperty( [ this.accumulatedKeysProperty ], function( accumulatedKeys ) {
      return self.keysToString( accumulatedKeys );
    } );

    // @public (read-only) - numerical value of the keys entered by the user
    this.valueProperty = new DerivedProperty( [ this.stringProperty ], function( stringValue ) {
      return self.stringToInteger( stringValue );
    } );
  }

  sceneryPhet.register( 'NumberAccumulator', NumberAccumulator );

  return inherit( AbstractKeyAccumulator, NumberAccumulator, {

    /**
     * invoked when a key is pressed and creates proposed set of keys to be passed to the validator
     * @param {KeyID} keyIdentifier - identifier for the key pressed
     * @public
     * @override
     */
    handleKeyPressed: function( keyIdentifier ) {
      var newArray = this.handleClearOnNextKeyPress( keyIdentifier );
      if ( this.isDigit( keyIdentifier ) ) {
        this.removeLeadingZero( newArray );
        newArray.push( keyIdentifier );

      }
      else if ( keyIdentifier === KeyID.BACKSPACE ) {
        newArray.pop();

      }
      else if ( keyIdentifier === KeyID.PLUS_MINUS ) {
        // check if first element of array is instance of this class
        if ( newArray.length > 0 && newArray[ 0 ] === KeyID.PLUS_MINUS ) {
          newArray.shift();
        }
        else {
          newArray.unshift( keyIdentifier );
        }
      }
      else if ( keyIdentifier === KeyID.DECIMAL ) {
        if ( !this.containsFloatingPoint( newArray ) ) {
          newArray.push( keyIdentifier );
        }
      }
      else {
        assert && assert( false, 'This type of Key is not supported Number Keypad' );
      }
      this.validateAndUpdate( newArray );
    },

    /**
     * removes leading zeros from the array
     * @param {Array.<KeyID>} array
     * @private
     */
    removeLeadingZero: function( array ) {
      if ( this.valueProperty.get() === 0 && !this.containsFloatingPoint( array ) ) {
        array.pop();
      }
    },

    /**
     * validate a proposed set of keys
     * @param {Array.<KeyID>} proposedKeys - the proposed set of keys, to be validated
     * @returns {boolean}
     * @public
     * @override
     */
    defaultValidator: function( proposedKeys ) {
      return ( this.getNumberOfDigits( proposedKeys ) <= this.maxDigits
               && !( this.getNumberOfDigits( proposedKeys ) === this.maxDigits
               && proposedKeys[ proposedKeys.length - 1 ] === KeyID.DECIMAL )
               && this.getNumberOfDigitsRightOfMantissa( proposedKeys ) <= this.maxDigitsRightOfMantissa
      );
    },

    /**
     * Converts a set of keys to a string.
     * @param {Array.<KeyID>} keys
     * @returns {string}
     * @private
     */
    keysToString: function( keys ) {

      var returnValue = '';
      var i = 0;

      // PlusMinusKey (if present) will be first key, and indicates that the number is negative
      if ( keys.length > 0 && keys[ i ] === KeyID.PLUS_MINUS ) {
        returnValue = NEGATIVE_CHAR;
        i++;
      }

      // process remaining keys
      for ( ; i < keys.length; i++ ) {

        if ( keys[ i ] === KeyID.DECIMAL ) {
          returnValue = returnValue + DECIMAL_CHAR;
        }
        else {
          
          // PlusMinusKey (if present) should only be first
          assert && assert( this.isDigit( keys[ i ] ), 'unexpected key type' );
          returnValue = returnValue + keys[ i ];
        }
      }

      return returnValue;
    },

    /**
     * Converts a string representation to a number.
     * @param {string} stringValue
     * @returns {number}
     * @private
     */
    stringToInteger: function( stringValue ) {
      var returnValue = null;

      // if stringValue contains something other than just a minus sign...
      if ( stringValue.length > 0
           && !( stringValue.length === 1 && stringValue[ 0 ] === NEGATIVE_CHAR )
           && ( this.getNumberOfDigitsLeftOfMantissa( this.accumulatedKeysProperty.get() ) > 0 ||
                this.getNumberOfDigitsRightOfMantissa( this.accumulatedKeysProperty.get() ) > 0 )
      ) {

        // replace Unicode minus with vanilla '-', or parseInt will fail for negative numbers
        returnValue = parseFloat( stringValue.replace( NEGATIVE_CHAR, '-' ).replace( DECIMAL_CHAR, '.' ) );
        assert && assert( !isNaN( returnValue ), 'invalid number: ' + returnValue );
      }

      return returnValue;
    },

    /**
     * Gets the number of digits to the left of mantissa in the accumulator.
     * @param {Array.<KeyID>} keys
     * @returns {number}
     * @private
     */
    getNumberOfDigitsLeftOfMantissa: function( keys ) {
      var numberOfDigits = 0;
      for ( var i = 0; i < keys.length; i++ ) {
        if ( this.isDigit( keys[ i ] ) ) {
          numberOfDigits++;
        }

        if ( keys[ i ] === KeyID.DECIMAL ) {
          break;
        }
      }
      return numberOfDigits;
    },

    /**
     * Gets the number of digits to the right of mantissa in the accumulator.
     * @param {Array.<KeyID>} keys
     * @returns {number}
     * @private
     */
    getNumberOfDigitsRightOfMantissa: function( keys ) {
      var decimalKeyIndex = keys.indexOf( KeyID.DECIMAL );
      var numberOfDigits = 0;
      if ( decimalKeyIndex >= 0 ) {
        for ( var i = decimalKeyIndex; i < keys.length; i++ ) {
          if ( this.isDigit( keys[ i ] ) ) {
            numberOfDigits++;
          }
        }
      }
      return numberOfDigits;
    },

    /**
     * Gets the number of digits in the accumulator.
     * @param {Array.<KeyID>} keys
     * @returns {number}
     * @private
     */
    getNumberOfDigits: function( keys ) {
      var numberOfDigits = 0;
      for ( var i = 0; i < keys.length; i++ ) {
        if ( this.isDigit( keys[ i ] ) ) {
          numberOfDigits++;
        }
      }
      return numberOfDigits;
    },

    /**
     * Gets the number of digits in the accumulator.
     * @param {Array.<KeyID>} keys
     * @returns {boolean}
     * @private
     */
    containsFloatingPoint: function( keys ) {
      return ( keys.indexOf( KeyID.DECIMAL ) >= 0 );
    },

    /**
     * Returns weather the character is valid digit or not
     * @param char
     * @returns {boolean}
     * @private
     */
    isDigit: function( char ) {
      return !isNaN( char ) && char >= '0' && char <= '9';
    },

    /**
     * clear the accumulator
     * @public
     */
    clear: function() {
      AbstractKeyAccumulator.prototype.clear.call( this );
      this.setClearOnNextKeyPress( false );
    },

    /**
     * Cleans up references.
     * @public
     */
    dispose: function(){
      this.valueProperty.dispose();
      this.stringProperty.dispose();
      AbstractKeyAccumulator.prototype.dispose.call( this );
    }

  } );
} );