import React, { Component } from 'react';

import './TopNav.css';
import Signup from './Signup';
import SignIn from './SignIn';

import firebase from '../firebase.js';

class TopNav extends Component {
  
  
  constructor(props) {
    super(props);

    this.state = {
      displaySignup: false,
      displaySignIn: false,
      userSignedIn: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('user is signed in');
        this.setState({userSignedIn: true});
      } else {
        // No user is signed in.
        console.log('user is NOT signed in');
        this.setState({userSignedIn: false});
      }
    });
  }

  handleSignupClick = () => {
    this.setState({displaySignup: true});
  };

  handleSignOutClick = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      this.setState({userSignedIn: false});
    }).catch(function(error) {
      // An error happened.
    });
  };

  handleSignInClick = () => {
    this.setState({displaySignIn: true});
  };

  hideSignup = () => {
    console.log('hide sign up')
    this.setState({displaySignup: false});
  }

  hideSignIn = () => {
    console.log('hide sign in')
    this.setState({displaySignIn: false});
  }

  render() {
    return (
      <div className="topNavContainer">
        {!this.state.userSignedIn && <div onClick={this.handleSignupClick}>Sign up</div>}
        {this.state.userSignedIn && <div onClick={this.handleSignOutClick}>Sign out</div>}
        {!this.state.userSignedIn && <div onClick={this.handleSignInClick}>Sign In</div>}
        {this.state.displaySignup && 
          <Signup
            hide={this.hideSignup}
          />
        }
        {this.state.displaySignIn && 
          <SignIn 
            hide={this.hideSignIn}
          />
        }
      </div>
    )
  }
};

export default TopNav;