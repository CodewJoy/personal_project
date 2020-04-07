import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import MessagePage from '../Message';
import ProfilePage from '../Profile';
import NotFoundPage from '../NotFound';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import { HOC } from './utils';


const App = () => (
  <FirebaseContext.Consumer>
    {(firebase) => <AppBase firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class AppBase extends Component {
  constructor(props) {
    super(props);
    this.updateUserData = (updateObject) => {
      this.setState(updateObject);
    };

    this.state = {
      authUser: "",
      userInfo: '',
      updateUserData: this.updateUserData,
      friendInvitation: ''
    };
  }
  componentDidMount() {
    const { firebase } = this.props;
    this.listener = firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          // snpashot method
          firebase.db.collection("Users").doc(authUser.uid)
            .onSnapshot(
              (doc) => {
                if (doc.exists) {
                  this.setState({ authUser: authUser, userInfo: doc.data() });
                }
                else {
                  console.log("No such document!");
                }
              }
              , (error) => {
                console.log(error)
              }
            )
          // update login timestamp
          firebase.db.collection("Users").doc(authUser.uid)
            .update(
              { timestamp: Date.now() }
            )
          // update friend invitation
          firebase.db.collection("Users").doc(authUser.uid).collection("friends")
            .where("status", "==", "askUrConfirm")
            .onSnapshot(
              (querySnapshot) => {
                let count = 0;
                querySnapshot.forEach(function (doc) {
                  if (doc) {
                    count += 1;
                  }
                });
                this.setState({ friendInvitation: count });
              }
            )
        } else {
          this.setState({ authUser: null });
        }
      }
    );
  }
  componentWillUnmount() {
    this.listener();
  }
  render() {
    const { authUser } = this.state;
    return (
      <AuthUserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.ACCOUNT} render={() => {
              const account = HOC(AccountPage, authUser)
              return(account)
            }} />
            <Route path={ROUTES.HOME} render={() => {
              const home = HOC(HomePage, authUser)
              return(home)
            }} />
            <Route path={ROUTES.MESSAGE} render={() => {
              const message = HOC(MessagePage, authUser)
              return(message)
            }} />
            <Route path={ROUTES.PROFILE} render={() => {
              const profile = HOC(ProfilePage, authUser)
              return(profile)
            }} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </Router>
      </AuthUserContext.Provider>
    )
  }
}

export default App;