// Copyright 2017, University of Colorado Boulder

/**
 * This file generates a file that holds all of the API information for the phet-io sim that is being built.
 * The output file will hold:
 * type documentation (common code and the specific sim)
 * instance documentation (a list of tandems and their types)
 * doc on simIFrameClient.launchSim() and its options
 * query parameter information, (phet and phet-io)
 * @author - Michael Kauzmann (PhET Interactive Simulations)
 */
/* eslint-env node */
'use strict';

// modules
var fs = require( 'fs' );
var getSimDocumentationFromWrapper = require( './getSimDocumentationFromWrapper' );

// constants
var DOCUMENTATION_PATH = '../chipper/templates/';
var DOCUMENTATION_FILENAME = 'phet-io-documentation.html';

module.exports = function( grunt, buildConfig, done ) {
  grunt.log.debug( 'Generating PhET-iO documentation' );

  var phetioDocumentationTemplateText = fs.readFileSync( DOCUMENTATION_PATH + DOCUMENTATION_FILENAME ).toString();

  // Add the phet query parameters to the template
  var phetQueryParameters =
    getSubstringFromFile( '../chipper/js/initialize-globals.js', 'QUERY_PARAMETERS_SCHEMA = ', '};' ) + '}';
  phetioDocumentationTemplateText = phetioDocumentationTemplateText.replace( '{{PHET_QUERY_PARAMETERS}}', phetQueryParameters );

  // Add the phet-io query parameters to the template
  var phetioQueryParameters =
    getSubstringFromFile( '../phet-io/js/phet-io-query-parameters.js', 'QUERY_PARAMETERS_SCHEMA = ', '};' ) + '}';
  phetioDocumentationTemplateText = phetioDocumentationTemplateText.replace( '{{PHETIO_QUERY_PARAMETERS}}', phetioQueryParameters );

  // Add the phet-io query parameters to the template
  var launchSimDocumentation =
    '/**' + // hack to get the jsdoc to look nice in the final html file.
    getSubstringFromFile( '../phet-io-wrappers/common/js/SimIFrameClient.js', '{{MARKER_FOR_GENERATING_DOCUMENTATION}}', '{{MARKER_END_FOR_GENERATING_DOCUMENTATION}}' );
  phetioDocumentationTemplateText = phetioDocumentationTemplateText.replace( '{{LAUNCH_SIM_DOC}}', launchSimDocumentation );

  getSimDocumentationFromWrapper( grunt, buildConfig.name, function( tandemsAndTypesString ) {
    var tandemInstancesAndTypes = JSON.parse( tandemsAndTypesString );

    var types = tandemInstancesAndTypes.types;
    var htmlTypes = typesToHTML( types );
    phetioDocumentationTemplateText =
      phetioDocumentationTemplateText.replace( '{{TYPES}}', htmlTypes );

    var instances = tandemInstancesAndTypes.instances;
    phetioDocumentationTemplateText =
      phetioDocumentationTemplateText.replace( '{{TANDEMS}}', instancesToHTML( instances ) );

    // Write the new documentation to html
    grunt.file.write( 'build/docs/' + DOCUMENTATION_FILENAME, phetioDocumentationTemplateText );
    grunt.log.debug( 'Wrote PhET-iO documentation file.' );
    done();
  } );
};

/**
 * Returns the string from marker to endMarker. Excluding both in the final result.
 * @param filename
 * @param marker - the text to find the beginning of the string
 * @param endMarker - marker to signal the end of the string to be returned from the file.
 * @returns {string} - query parameter string
 */
function getSubstringFromFile( filename, marker, endMarker ) {

  var fileText = fs.readFileSync( filename ).toString();
  var startIndex = fileText.indexOf( marker ) + marker.length;
  var endIndex = startIndex + fileText.substring( startIndex ).indexOf( endMarker );

  return fileText.substring( startIndex, endIndex );
}

/**
 * @param {Object} json
 * @returns {string} - the htmlified string
 */
function typesToHTML( json ) {
  var html = '';
  var types = _.sortBy( _.keys( json ), function( key ) {
    return key;
  } );
  for ( var i = 0; i < types.length; i++ ) {

    var typeName = types[ i ];
    var typeObject = json[ typeName ];
    var methods = '';
    var sortedMethodNames = _.sortBy( _.keys( typeObject.methods ), function( key ) {
      return key;
    } );
    for ( var k = 0; k < sortedMethodNames.length; k++ ) {
      var methodName = sortedMethodNames[ k ];
      var method = typeObject.methods[ methodName ];
      var params = method.parameterTypes.join( ', ' );
      methods += '<DT>' + methodName + ': (' + params + ') &#10142; ' + method.returnType + '</DT>' +
                 '<DD>' + method.documentation + '</DD>';
    }

    // Include events if there are events, or if the `events` property is an empty array
    var eventsString = (typeObject.events && typeObject.events.length !== 0) ?
                       '<span><b>events:</b> ' + typeObject.events.join( ', ' ) + '</span>' : '';

    var supertype = typeObject.supertype;
    html = html + '<h5 class="typeName" id="phetioType' + typeName + '">' + typeName + ' ' +
           (supertype ? '(extends <a class="supertypeLink" href="#phetioType' + supertype.typeName + '">' + supertype.typeName + '</a>)' : '') +
           '</h5>' +
           '<div class="typeDeclarationBody">' +
           '<span>' + typeObject.documentation + '</span><br>' +
           eventsString +
           '<DL>' + methods + '</DL></div>';
  }
  return html;
}

function instancesToHTML( json ) {
  var html = '';
  var types = _.sortBy( _.keys( json ), function( key ) {
    return key;
  } );
  for ( var i = 0; i < types.length; i++ ) {
    var tandem = types[ i ];
    var typeObject = json[ tandem ];

    html = html + '<h5 class="typeName" id="phetioTandem' + tandem + '">' + tandem + ' ' +
           '</h5>' +
           '<DT>' + typeObject.typeName + '</DT>' +
           '<div class="typeDeclarationBody">' +
           '<span>' + typeObject.instanceDocumentation + '</span></div><br>';
  }
  return html;

}