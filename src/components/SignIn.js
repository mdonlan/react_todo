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

  close = (event) => {
    // close the signup window
    let elem = event.target.parentElement;
    elem.style.top = '120%';
    setTimeout(() => {
      elem.style.transition = 'none';
      elem.style.top = 'calc(-50% - 400px)';
    }, 1000)
  }

  render() {
    return (
      <div>
        {!this.state.loading &&
          <div className="signInContainer" data-ispanel={true}>
            Sign In
            <input className="signInInput emailInput" placeholder="email" onKeyPress={this.onChange} data-ispanel={true}/>
            <input className="signInInput passwordInput" placeholder="password" type="password" onKeyPress={this.onChange} data-ispanel={true}/>
            <div className="signInButton" onClick={this.handleSignInClick} data-ispanel={true}>Sign In</div>
            <div className="errorSignIn" data-ispanel={true}>{this.state.errorMessage}</div>
            <div className="closeButton" onClick={this.close} dangerouslySetInnerHTML={{__html: `&#x2716`}}></div>
          </div>
        }
        {this.state.loading && <Loading />}
      </div>
    )
  }
};

export default SignIn;