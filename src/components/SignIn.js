import React, { Component } from 'react';

import './SignIn.css';
import firebase from '../firebase.js';

class SignIn extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
    };
  }

  handleSignInClick = () => {
    let emailElem = document.querySelector(".emailInput");
    let passwordElem = document.querySelector(".passwordInput");
    let email = emailElem.value;
    let password = passwordElem.value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      //console.log('sign in successful')
      this.props.hide();
    }).catch((error) => {
      // Handle Errors here.
      this.setState({errorMessage: error.message})
      passwordElem.value = '';
    });
  }


  render() {
    return (
      <div className="signInContainer">
        <input className="signInInput emailInput" placeholder="email" />
        <input className="signInInput passwordInput" placeholder="password" type="password" />
        <div onClick={this.handleSignInClick}>Sign In</div>
        <div className="errorSignIn">{this.state.errorMessage}</div>
      </div>
    )
  }
};

export default SignIn;