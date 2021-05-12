/**
 * This module isolates the logic associated with
 * creating a React context to pass Firebase communication
 * information throughout the application
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React from 'react';
 
const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);
 
export default FirebaseContext;
