import React from 'react';
 
import { withFirebase } from '../Firebase';
 
const LogoutButton = ({ firebase }) => (
  <button className="btn logout-button" type="button" onClick={firebase.doSignOut}>
    Logout
  </button>
);
 
export default withFirebase(LogoutButton);