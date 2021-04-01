import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
 
const Navigation = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.LANDING_SCREEN}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME_SCREEN}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.REGISTER_SCREEN}>Register</Link>
      </li>
      <li>
        <Link to={ROUTES.LOGIN_SCREEN}>Login</Link>
      </li>
  
    </ul>
  </div>
);
 
export default Navigation;