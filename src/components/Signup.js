import React, { Component } from 'react';

import './Signup.css';
import firebase from '../firebase.js';

class Signup extends Component {
  
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleCreateAccountClick = () => {
    let email = document.querySelector(".emailInput").value;
    let password = document.querySelector(".passwordInput").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      //console.log('sign up successful')
      this.props.hide();
    }).catch(function(error) {
      console.log(error)
    });
  }


  render() {
    return (
      <div className="signupContainer">
        <input className="signupInput emailInput" placeholder="email" />
        <input className="signupInput passwordInput" placeholder="password" type="password" />
        <div onClick={this.handleCreateAccountClick}>Create Account</div>
      </div>
    )
  }
};

export default Signup;