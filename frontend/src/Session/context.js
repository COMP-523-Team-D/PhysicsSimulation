/**
 * This module isolates the logic associated with
 * creating a React context to pass authorized
 * user data throughout the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React from 'react';
 
const AuthUserContext = React.createContext(null);
 
export default AuthUserContext;