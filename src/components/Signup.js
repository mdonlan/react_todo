import React, { Component } from 'react';

import './Signup.css';
import firebase from '../firebase.js';
import Loading from './Loading';

class Signup extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      loading: false,
    };
  }

  handleCreateAccountClick = () => {
    let emailElem = document.querySelector(".emailInput");
    let passwordElem = document.querySelector(".passwordInput");
    let email = emailElem.value;
    let password = passwordElem.value;

    this.setState({loading: true});
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      //console.log('sign up successful')
      this.props.hide();
      this.setState({loading: false});
    }).catch((error) => {
      this.setState({loading: false});
      console.log(error)
      this.setState({errorMessage: error.message})
      passwordElem.value = '';
    });
  }

  onChange = (event) => {
    if(event.key === 'Enter') {
      let signupButton = document.querySelector(".signupButton");
      signupButton.click();
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
          <div className="signupContainer" data-ispanel={true}>
            Create New Account
            <input className="signupInput emailInput" placeholder="email" onKeyPress={this.onChange} data-ispanel={true}/>
            <input className="signupInput passwordInput" placeholder="password" type="password" onKeyPress={this.onChange} data-ispanel={true}/>
            <div className="signupButton" onClick={this.handleCreateAccountClick} data-ispanel={true}>Create Account</div>
            <div className="errorSignIn" data-ispanel={true}>{this.state.errorMessage}</div>
            <div className="closeButton" onClick={this.close} dangerouslySetInnerHTML={{__html: `&#x2716`}}></div>
          </div>
        }
        {this.state.loading && <Loading />}
      </div>
    )
  }
};

export default Signup;