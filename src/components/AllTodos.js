import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import shortid from 'shortid';

// icons
import faTrash from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt';

import './allTodos.css';

class AllTodos extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.deleteTodo = this.deleteTodo.bind(this);
    this.completedTodo = this.completedTodo.bind(this);
  }

  deleteTodo(event) {
    this.props.deleteNote(event.target.dataset.index);
  }

  completedTodo(event) {
    this.props.completedNote(event.target.dataset.index);
  }

  render() {

    return (
      <div className="allTodosContainer">
        {this.props.allTodos.map((todo, index) => {
          return (
            <div key={shortid.generate()} className="todoItem">
              <div className="leftSideTodo">
                <FontAwesomeIcon className={(todo.completed ? 'completeButtonComplete' : 'completeButtonDefault') + " button"} icon={faCheck} onClick={this.completedTodo} data-index={index} />
                <div>{todo.todoText}</div>
              </div>
              <div className="rightSideTodo">
                <FontAwesomeIcon className="editButton button" icon={faPencil}/>
                <FontAwesomeIcon className="deleteButton button" icon={faTrash} onClick={this.deleteTodo} data-index={index} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default AllTodos;