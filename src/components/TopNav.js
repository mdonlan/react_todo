import React, { Component } from 'react';

import './TopNav.css';
import Signup from './Signup';
import SignIn from './SignIn';
import TodoFilters from './TodoFilters';
import NewList from './NewList';

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
        //console.log('user is signed in');
        this.setState({userSignedIn: true});
      } else {
        // No user is signed in.
        //console.log('user is NOT signed in');
        this.setState({userSignedIn: false});
      }
    });
  }

  handleSignupClick = () => {
    this.setState({displaySignup: true});
    this.setState({displaySignIn: false});
    setTimeout(() => {
      let signupElem = document.querySelector(".signupContainer");
      signupElem.style.top = 'calc(50% - 325px)';
      signupElem.style.transition = '1s';
    }, 50)
  };

  handleSignOutClick = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      this.setState({userSignedIn: false});
      this.props.userSignedOut();
    }).catch(function(error) {
      // An error happened.
    });
  };

  handleSignInClick = () => {
    this.setState({displaySignIn: true});
    this.setState({displaySignup: false});
    setTimeout(() => {
      let signInElem = document.querySelector(".signInContainer");
      signInElem.style.top = 'calc(50% - 325px)';
      signInElem.style.transition = '1s';
    }, 50)
  };

  hideSignup = () => {
    console.log('hide sign up')
    this.setState({displaySignup: false});
  }

  hideSignIn = () => {
    console.log('hide sign in')
    this.setState({displaySignIn: false});
  }

  createNewList = (value) => {
     this.props.createNewList(value);
  }

  updateSearchQuery = (value) => {
    this.props.updateSearchQuery(value);
  }

  toggleFilteringComplete = () => {
    this.props.toggleFilteringComplete();
  }

  

  render() {
    return (
      <div className="topNavContainer">
        <div className="left">
          <NewList 
            createNewList={this.createNewList} 
          />
          <TodoFilters 
            filteringCompleted={this.state.filteringCompleted}
            toggleFilteringComplete={this.toggleFilteringComplete}
            updateSearchQuery={this.updateSearchQuery}
            changeViewLayout={this.changeViewLayout}
          />
        </div>
        <div className="right">
          {!this.state.userSignedIn && <div className="topNavSignUp topNavButton" onClick={this.handleSignupClick}>Sign up</div>}
          {this.state.userSignedIn && <div className="topNavSignOu topNavButton" onClick={this.handleSignOutClick}>Sign out</div>}
          {!this.state.userSignedIn && <div className="topNavSignIn topNavButton" onClick={this.handleSignInClick}>Sign In</div>}
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
      </div>
    )
  }
};

export default TopNav;