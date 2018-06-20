import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import faTrash from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';
import faDrag from '@fortawesome/fontawesome-free-solid/faArrowsAlt';

import './Note.css';

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

  setEditMode = (event) => {
    // toggle edit mode
    
    let data = {
      noteKey: event.target.dataset.notekey,
      listKey: event.target.dataset.listkey,
    }
    
    this.props.setEditMode(data);
    //this.setState({tempNote: event.target.dataset.text});
  };

  deleteTodo = (event) => {
    let data = {
      noteKey: event.target.dataset.notekey,
      listKey: event.target.dataset.listkey,
    }
    this.props.deleteTodo(data);
  }

  completedTodo = (event) => {
    this.props.completedNote(event.target.dataset.key);
  }

  render() {
    let isEditable = this.props.note.editable;
    return (
      <div className="todoItem">
      <div className="leftSideTodo">
      <div className="circleBackground">
        <div className="circleClickZone" onClick={this.completedTodo} data-key={this.props.note.key}></div>
        <FontAwesomeIcon className={(this.props.note.completed ? 'completeButtonComplete' : 'completeButtonDefault') + " button"} icon={faCheck} />
      </div>
        <textarea 
          key={(this.props.note.key + 'textArea')} 
          disabled={this.props.note.editable ? false : true} 
          className={(this.props.note.completed ? 'todoTextFaded' : 'todoText') + ' ' + (this.props.note.editable ? 'editingTodo' : null)} 
          defaultValue={this.props.note.todoText} 
          onChange={this.editedNote}
          data-notekey={this.props.note.key}
        >
        </textarea>
        </div>
        <div className="rightSideTodo"> 
          {isEditable ? 
            <FontAwesomeIcon visibility={this.props.note.editable ? 'visible' : 'hidden'} className="saveEditButton button" icon={faSave} data-notekey={this.props.note.key} onClick={this.handleSave} /> 
            : 
            <FontAwesomeIcon visibility={this.props.note.editable ? 'hidden' : 'visible'} className="editButton button" icon={faPencil} onClick={this.setEditMode} data-notekey={this.props.note.key} data-listkey={this.props.note.onListKey} data-text={this.props.note.todoText} />
            }
          <FontAwesomeIcon className="deleteButton button" icon={faTrash} onClick={this.deleteTodo} data-notekey={this.props.note.key} data-listkey={this.props.note.onListKey} />
        </div>
      </div>
    )
  }
};

export default Note;