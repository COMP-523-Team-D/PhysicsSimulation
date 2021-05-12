/**
 * This module contains the logic for
 * authenticating users within the application
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React from 'react';
import { withFirebase } from "../Firebase";
import AuthUserContext from './context';
 
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
        super(props);
   
        this.state = {
          authUser: null,
          authUserData: null
        };
    }

    componentDidMount() {
        /*
         * Initializes a frontend listener for backend state
         * related to authenticated users. This ensures that
         * current authenticated user state is available within
         * the application.
         */
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          authUser => {
            if(authUser) {
              this.setState({ authUser: authUser });
              this.props.firebase.user(authUser.uid)
                  .get()
                  .then((doc) => { doc.exists ? this.setState({ authUserData: doc.data() }) : this.setState({ authUserData: null }); })
                  .catch((error) => { this.setState({ authUserData: null}); console.log(error); });
            }else {
              this.setState({
                authUser: null,
                authUserData: null
              });
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUserData}>
            <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
 
  return withFirebase(WithAuthentication);
};
 
export default withAuthentication;