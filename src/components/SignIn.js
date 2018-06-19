import React, { Component } from 'react';

import './SignIn.css';
import firebase from '../firebase.js';
import Loading from './Loading';

class SignIn extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      loading: false,
    };
  }

  handleSignInClick = () => {
    let emailElem = document.querySelector(".emailInput");
    let passwordElem = document.querySelector(".passwordInput");
    let email = emailElem.value;
    let password = passwordElem.value;

    this.setState({loading: true});
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      //console.log('sign in successful')
      this.props.hide();
      this.setState({loading: false});
    }).catch((error) => {
      // Handle Errors here.
      this.setState({errorMessage: error.message})
      this.setState({loading: false});
      passwordElem.value = '';
    });
  }

  onChange = (event) => {
    if(event.key === 'Enter') {
      let signInButton = document.querySelector(".signInButton");
      signInButton.click();
    }
  }


  render() {
    return (
      <div>
        {!this.state.loading &&
          <div className="signInContainer">
            Sign In
            <input className="signInInput emailInput" placeholder="email" onKeyPress={this.onChange}/>
            <input className="signInInput passwordInput" placeholder="password" type="password" onKeyPress={this.onChange} />
            <div className="signInButton" onClick={this.handleSignInClick}>Sign In</div>
            <div className="errorSignIn">{this.state.errorMessage}</div>
          </div>
        }
        {this.state.loading && <Loading />}
      </div>
    )
  }
};

export default SignIn;