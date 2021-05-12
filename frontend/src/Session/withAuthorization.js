/**
 * This module contains the logic for
 * authorizing users within the application
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import AuthUserContext from './context';
import * as ROUTES from '../constants/routes';
 
const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
        /*
         * Initializes a frontend listener for backend state
         * related to authenticated users. This ensures that
         * only authenticated users can view protected routes.
         */
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          authUser => {
            if (!condition(authUser)) {
              this.props.history.push(ROUTES.LANDING_SCREEN);
            }
          },
        );
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
            {authUser => condition(authUser) ? <Component {...this.props} /> : null}
        </AuthUserContext.Consumer>
      );
    }
  }
 
  return withRouter(withFirebase(WithAuthorization));
};
 
export default withAuthorization;