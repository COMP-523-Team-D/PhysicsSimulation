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