import React, { Component } from 'react';

class Note extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      tempNote: this.props.tempNote,
      activeNoteText: null,
    };
  }

  editedNote = (event) => {
    //console.log(event.target.value)
    let data = {
      key: event.target.dataset.notekey,
      value: event.target.value
    }
    //this.props.editedNote(data);
    this.setState({activeNoteText: data.value})
  }

  handleSave = (event) => {
    let data = {
      value: this.state.activeNoteText,
      key: event.target.dataset.notekey,
    }
    this.props.handleSave(data)
  }

  render() {
    return (
      <div>
        <textarea 
          key={(this.props.note.key + 'textArea')} 
          disabled={this.props.note.editable ? false : true} 
          className={(this.props.note.completed ? 'todoTextFaded' : 'todoText') + ' ' + (this.props.note.editable ? 'editingTodo' : null)} 
          defaultValue={this.props.note.editable ? this.state.tempNote : this.props.note.todoText} 
          onChange={this.editedNote}
          data-notekey={this.props.note.key}
        >
        </textarea>
        <div data-notekey={this.props.note.key} onClick={this.handleSave}>save</div>
      </div>
    )
  }
};

export default Note;