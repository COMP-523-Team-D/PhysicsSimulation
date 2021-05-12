/**
 * This React module isolates the logic needed
 * for the log-out button on the website header.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 * @author Molly Crown
 */

import React from 'react';
 
import { withFirebase } from '../Firebase';
 
const LogoutButton = ({ firebase }) => (
  <button className="btn logout-button" type="button" onClick={firebase.doSignOut}>
    Logout
  </button>
);
 
export default withFirebase(LogoutButton);