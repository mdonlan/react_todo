import React, { Component } from 'react';

import './NewNote.css';

class NewNote extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      newNoteName: '',
    };
  }


  handleChange = (event) => {
    // keep track of input in state
    this.setState({newNoteName: event.target.value});
    //console.log('test')
  }

  handleSubmit = (event) => {
    
    event.preventDefault();

    //console.log('testing')

    // on submit use the new note state data
    // to send it up to the parent componenet
    // to be added to all todos

    let data = {
      thisListKey: this.props.listKey,
      note: this.state.newNoteName,
    }
    this.props.createNewNote(data);

    // reset note value
    this.setState({newNoteName: ''});
  }

  render() {
    return (
      <div className="newTodoContainer">
        <input className="newTodoInput" type="text" name="newNoteText" onChange={this.handleChange} value={this.state.newNoteName} placeholder="Create a new todo..." />
        <div className="newTodoSubmit" onClick={this.handleSubmit}>Submit</div>
      </div>
    )
  }
};

export default NewNote;