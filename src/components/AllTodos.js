import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

// icons
import faTrash from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';

import './allTodos.css';

class AllTodos extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      tempNote: '',
      filter: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    // on props update if
    nextProps.allTodos.forEach(function(value, i) {
      //console.log(value);
    });
  }

  deleteTodo = (event) => {
    this.props.deleteNote(event.target.dataset.key);
  }

  completedTodo = (event) => {
    this.props.completedNote(event.target.dataset.key);
  }
  
  setEditMode = (event) => {
    // turn on edit mode
    
    this.props.setEditMode(event.target.dataset.key);
    this.setState({tempNote: event.target.dataset.text});
  }

  saveEdit = (event) => {
    // send new edit to parent to be added to state
    let tempEditData = [
      this.state.tempNote, 
      event.target.dataset.key,
    ]
   this.props.saveEdit(tempEditData);

   //after updating note text clear tempNote
   this.setState({tempNote: ''});
  }

  editedNote = (event) => {
    this.setState({tempNote: event.target.value});
  }

  filterTodos = (item) => {
    
    
    if(this.props.filteringCompleted === true && this.props.searchQuery.length > 0) {
      // if filtering out complete and searching 
      if(item.completed === false) {
        if(item.todoText.indexOf(this.props.searchQuery) >= 0) {
          return item
        }
      }
    } else if(this.props.searchQuery.length > 0){
        // if searching filter out notes that don't match query
        return item.todoText.indexOf(this.props.searchQuery) >= 0;
    } else if(this.props.filteringCompleted === true) {

      // if todo is marked completed filter out of array
      return item.completed === false;
    } else {
      // if no filter return all
      return item
    }
  }

  render() {

    return (
      <div className="allTodosContainer">
        {this.props.allTodos.filter(this.filterTodos).map((todo, index) => {
          let isEditable = todo.editable; 
          return (
            <div key={todo.key} className="todoItem">
              <div className="leftSideTodo">
                <div className="circleBackground">
                  <div className="circleClickZone" onClick={this.completedTodo} data-key={todo.key}></div>
                  <FontAwesomeIcon className={(todo.completed ? 'completeButtonComplete' : 'completeButtonDefault') + " button"} icon={faCheck} />
                </div>
                <textarea disabled={todo.editable ? false : true} className={(todo.completed ? 'todoTextFaded' : 'todoText') + ' ' + (todo.editable ? 'editingTodo' : null)} defaultValue={todo.editable ? this.state.tempNote : todo.todoText} onChange={this.editedNote} ></textarea>
              </div>
              <div className="rightSideTodo">
                {isEditable ? 
                  <FontAwesomeIcon visibility={todo.editable ? 'visible' : 'hidden'} className="saveEditButton button" icon={faSave} onClick={this.saveEdit} data-key={todo.key} /> 
                  : 
                  <FontAwesomeIcon visibility={todo.editable ? 'hidden' : 'visible'} className="editButton button" icon={faPencil} onClick={this.setEditMode} data-key={todo.key} data-text={todo.todoText} />
                  }
                <FontAwesomeIcon className="deleteButton button" icon={faTrash} onClick={this.deleteTodo} data-key={todo.key} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default AllTodos;