import React from 'react';
 
import { withFirebase } from '../Firebase';
 
const LogoutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}>
    Logout
  </button>
);
 
export default withFirebase(LogoutButton);