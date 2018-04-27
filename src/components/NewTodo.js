import React, { Component } from 'react';

import './newTodo.css';

class NewTodo extends Component {
  
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      newNoteValue: '',
    };
  }


  handleChange(event) {
    // keep track of input in state
    this.setState({newNoteValue: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    // on submit use the new note state data
    // to send it up to the parent componenet
    // to be added to all todos
    
    this.props.createNewNote(this.state.newNoteValue);

    // reset note value
    this.setState({newNoteValue: ''});
  }

  render() {
    return (
      <div className="newTodoContainer">
        <input className="newTodoInput" type="text" name="newNoteText" onChange={this.handleChange} value={this.state.newNoteValue}/>
        <div className="newTodoSubmit" onClick={this.handleSubmit}>Submit</div>
      </div>
    )
  }
};

export default NewTodo;