import React, { Component } from 'react';

import './NewList.css';

class NewList extends Component {
  
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      newListName: '',
    };
  }


  handleChange(event) {
    // keep track of input in state
    this.setState({newListName: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    // on submit use the new note state data
    // to send it up to the parent componenet
    // to be added to all todos
    
    this.props.createNewList(this.state.newListName);

    // reset note value
    this.setState({newListName: ''});
  }

  render() {
    return (
      <div className="newTodoContainer">
        <input className="newTodoInput" type="text" name="newNoteText" onChange={this.handleChange} value={this.state.newListName} placeholder="Create a new list..." />
        <div className="newTodoSubmit" onClick={this.handleSubmit}>Submit</div>
      </div>
    )
  }
};

export default NewList;