import React, { Component } from 'react';

class Note extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      tempNote: this.props.tempNote,
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
      <textarea key={(this.props.note.key + 'textArea')} disabled={this.props.note.editable ? false : true} className={(this.props.note.completed ? 'todoTextFaded' : 'todoText') + ' ' + (this.props.note.editable ? 'editingTodo' : null)} defaultValue={this.props.note.editable ? this.state.tempNote : this.props.note.todoText} onChange={this.editedNote} ></textarea>
    )
  }
};

export default Note;