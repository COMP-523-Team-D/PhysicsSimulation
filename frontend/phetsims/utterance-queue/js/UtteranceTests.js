// Copyright 2019-2020, University of Colorado Boulder

/**
 * QUnit tests for Utterance and utteranceQueue
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import stepTimer from '../../axon/js/stepTimer.js';
import AriaHerald from './AriaHerald.js';
import Utterance from './Utterance.js';
import UtteranceQueue from './UtteranceQueue.js';

let sleepTiming = null;

const ariaHerald = new AriaHerald();
const utteranceQueue = new UtteranceQueue( ariaHerald );

// helper es6 functions from  https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout/33292942
function timeout( ms ) {
  return new Promise( resolve => setTimeout( resolve, ms ) ); // eslint-disable-line bad-sim-text
}

async function sleep( fn, ...args ) {

  assert && assert( typeof sleepTiming === 'number' && sleepTiming > 0 );
  await timeout( sleepTiming );
  return fn( ...args );
}

let alerts = [];

let intervalID = null;
QUnit.module( 'Utterance', {
  before() {

    // timer step in seconds, stepped every 10 millisecond
    const timerInterval = 1 / 3;

    // step the timer, because utteranceQueue runs on timer
    intervalID = setInterval( () => { // eslint-disable-line bad-sim-text
      stepTimer.emit( timerInterval ); // step timer in seconds, every millisecond
    }, timerInterval * 1000 );

    // whenever announcing, get a callback and populate the alerts array
    ariaHerald.announcingEmitter.addListener( text => {
      alerts.unshift( text );
    } );

    // slightly slower than the interval that the utteranceQueue will wait so we don't have a race condition
    sleepTiming = timerInterval * 1000 * 1.1;
  },
  beforeEach() {

    // clear the alerts before each new test
    alerts = [];
    utteranceQueue.clear();
  },
  after() {
    clearInterval( intervalID );
  }
} );

QUnit.test( 'Basic Utterance testing', async assert => {

  // for this test, we just want to verify that the alert makes it through to ariaHerald
  const alertContent = 'hi';
  const myAlert = new Utterance( {
    alert: alertContent,
    alertStableDelay: 0 // alert as fast as possible
  } );
  utteranceQueue.addToBack( myAlert );

  await sleep( () => {
    assert.ok( alerts[ 0 ] === alertContent, 'first alert made it to ariaHerald' );
  } );

  utteranceQueue.addToBack( 'alert' );
  await sleep( () => {
    assert.ok( alerts[ 0 ] === 'alert', 'second alert made it to ariaHerald' );
  } );
} );

QUnit.test( 'Utterance options', async assert => {

  const alert = new Utterance( {
    alert: [ '1', '2', '3' ],
    alertStableDelay: 0 // alert as fast as possible, we want to hear the utterance every time it is added to the queue
  } );

  const alert4 = async () => {
    for ( let i = 0; i < 4; i++ ) {
      utteranceQueue.addToBack( alert );
      await timeout( sleepTiming );
    }
  };

  const testOrder = messageSuffix => {

    // newest at lowest index because of unshift
    assert.ok( alerts[ 3 ] === '1', `Array order1${messageSuffix}` );
    assert.ok( alerts[ 2 ] === '2', `Array order2${messageSuffix}` );
    assert.ok( alerts[ 1 ] === '3', `Array order3${messageSuffix}` );
    assert.ok( alerts[ 0 ] === '3', `Array order4${messageSuffix}` );
  };

  await alert4();
  testOrder( '' );
  alert.reset();
  await alert4();
  testOrder( ', reset should start over' );
} );


QUnit.test( 'Utterance loopAlerts', async assert => {

  const alert = new Utterance( {
    alert: [ '1', '2', '3' ],
    loopAlerts: true,
    alertStableDelay: 0 // we want to hear the utterance every time it is added to the queue
  } );

  const alert7 = async () => {
    for ( let i = 0; i < 7; i++ ) {
      utteranceQueue.addToBack( alert );
      await timeout( sleepTiming );
    }
  };

  const testOrder = messageSuffix => {

    // newest at lowest index
    assert.ok( alerts[ 6 ] === '1', `Array order1${messageSuffix}` );
    assert.ok( alerts[ 5 ] === '2', `Array order2${messageSuffix}` );
    assert.ok( alerts[ 4 ] === '3', `Array order3${messageSuffix}` );
    assert.ok( alerts[ 3 ] === '1', `Array order4${messageSuffix}` );
    assert.ok( alerts[ 2 ] === '2', `Array order5${messageSuffix}` );
    assert.ok( alerts[ 1 ] === '3', `Array order6${messageSuffix}` );
    assert.ok( alerts[ 0 ] === '1', `Array order7${messageSuffix}` );
  };

  await alert7();
  testOrder( '' );
  alert.reset();
  await alert7();
  testOrder( ', reset should start over' );
} );

QUnit.test( 'alertStable and alertStableDelay tests', async assert => {
  const highFrequencyUtterance = new Utterance( { alert: 'Rapidly Changing' } );

  const numAlerts = 4;

  // add the utterance to the back many times, by default they should collapse
  for ( let i = 0; i < numAlerts; i++ ) {
    utteranceQueue.addToBack( highFrequencyUtterance );
  }
  assert.ok( utteranceQueue.queue.length === 1, 'utterances should collapse by default after addToBack' );

  for ( let i = 0; i < numAlerts; i++ ) {
    utteranceQueue.addToFront( highFrequencyUtterance );
  }
  assert.ok( utteranceQueue.queue.length === 1, 'utterances should collapse by default after addToFront' );

  await timeout( sleepTiming * 4 );
  assert.ok( alerts.length === 1, ' we only heard one alert after they became stable' );


  /////////////////////////////////////////

  alerts = [];
  const stableDelay = 1100;
  const myUtterance = new Utterance( {
    alert: 'hi',
    alertStableDelay: stableDelay
  } );

  for ( let i = 0; i < 100; i++ ) {
    utteranceQueue.addToBack( myUtterance );
  }

  assert.ok( utteranceQueue.queue.length === 1, 'same Utterance should override in queue' );
  await timeout( sleepTiming );

  assert.ok( myUtterance.stableTime >= myUtterance.timeInQueue, 'utterance should be in queue for at least stableDelay' );

  assert.ok( utteranceQueue.queue.length === 1, 'Alert still in queue after waiting less than alertStableDelay but more than stepInterval.' );
  await timeout( stableDelay );

  assert.ok( utteranceQueue.queue.length === 0, 'Utterance alerted after alertStableDelay time passed' );
  assert.ok( alerts.length === 1, 'utterance ended up in alerts list' );
  assert.ok( alerts[ 0 ] === myUtterance.alert, 'utterance text matches that which is expected' );
} );