import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import MessagePage from '../Message';
import ProfilePage from '../Profile';

import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';

const App = () => (
  <FirebaseContext.Consumer>
    {(firebase) => <AppBase firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class AppBase extends Component {
  constructor(props) {
    super(props);

    this.updateUserData = (authInfo) => {
      this.setState(({
        authInfo: authInfo
      }))
    };

    this.state = {
      authUser: null,
      userInfo: '',
      updateUserData: this.updateUserData
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        console.log(authUser);
        if (authUser) {
          // snpashot method
          this.props.firebase.db.collection("Users").doc(authUser.uid)
            .onSnapshot(
              (doc) => {
                // console.log("Current data: ", doc.data())
                if (doc.exists) {
                  console.log("Document data:", doc.data());
                  this.setState({ userInfo: doc.data() })
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              },
              (error) => {
                console.log(error)
              }
            )

        //// get method
        //   this.props.firebase.db.collection("Users").doc(authUser.uid)
        //     .get()
        //     .then(
        //       (doc) => {
        //         if (doc.exists) {
        //           console.log("Document data:", doc.data());
        //           this.setState({ userInfo: doc.data() })
        //         } else {
        //           // doc.data() will be undefined in this case
        //           console.log("No such document!");
        //         }
        //       }
        //     )
        //     .catch(function (error) {
        //       console.log("Error getting document:", error);
        //     });
        // }
        }
        authUser
          ? this.setState({ authUser: authUser })
          : this.setState({ authUser: null });
      },
    );
  }
  componentWillUnmount() {
    this.listener();
  }
  render() {
    return (
      <AuthUserContext.Provider value={this.state}>
        <Router>
          <>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.MESSAGE} component={MessagePage} />
            <Route path={ROUTES.PROFILE} component={ProfilePage} />
          </>
        </Router>
      </AuthUserContext.Provider>
    )
  }
}
export default App;
// export default withFirebase(App);