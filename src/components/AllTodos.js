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
    
    // if todo is marked completed filter out of array
    if(this.props.filteringCompleted === true) {
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
          return (
            <div key={todo.key} className="todoItem">
              <div className="leftSideTodo">
                <div className="circleBackground">
                  <FontAwesomeIcon className={(todo.completed ? 'completeButtonComplete' : 'completeButtonDefault') + " button"} icon={faCheck} onClick={this.completedTodo} data-key={todo.key} />
                </div>
                
                <textarea disabled={todo.editable ? false : true} className={(todo.completed ? 'todoTextFaded' : 'todoText') + ' ' + (todo.editable ? 'editingTodo' : null)} defaultValue={todo.editable ? this.state.tempNote : todo.todoText} onChange={this.editedNote} ></textarea>
              </div>
              <div className="rightSideTodo">
                <FontAwesomeIcon visibility={todo.editable ? 'visible' : 'hidden'} className="saveEditButton button" icon={faSave} onClick={this.saveEdit} data-key={todo.key} />
                <FontAwesomeIcon visibility={todo.editable ? 'hidden' : 'visible'} className="editButton button" icon={faPencil} onClick={this.setEditMode} data-key={todo.key} data-text={todo.todoText} />
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