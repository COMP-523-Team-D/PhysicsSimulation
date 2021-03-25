// Copyright 2019-2020, University of Colorado Boulder

/**
 * An utterance that should generally be used for announcing a change in value after interacting with a slider
 * or number type input. Often, changes to a value are announced with aria-valuetext, but additional information about
 * the change is conveyed by a supplemental Utterance. The delay ensures that VoiceOver and JAWS will announce the
 * alert after reading the aria-valuetext in full. See https://github.com/phetsims/scenery-phet/issues/491 and
 * https://github.com/phetsims/john-travoltage/issues/315 for testing notes.
 *
 * @author Jesse Greenberg
 */

import merge from '../../phet-core/js/merge.js';
import Utterance from './Utterance.js';
import utteranceQueueNamespace from './utteranceQueueNamespace.js';

class ValueChangeUtterance extends Utterance {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {number} - in ms, prevents VoiceOver from reading changes too frequently or interrupting the alert to read
      // aria-valuetext changes under typical user settings
      alertStableDelay: 1000
    }, options );

    super( options );
  }
}

utteranceQueueNamespace.register( 'ValueChangeUtterance', ValueChangeUtterance );
export default ValueChangeUtterance;