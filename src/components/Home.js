import React, { Component } from 'react';

import NewTodo from './NewTodo';
import AllTodos from './AllTodos';

import './home.css';

class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        
      ],
    };
  }

  createNewNote = (data) => {
    let newNote = {
      completed: false,
      todoText: data,
    }
    // this is a prop callback for adding new notes to the state
    let allTodos = this.state.todos;
    allTodos.push(newNote);
    this.setState({todos: allTodos});
  }

  deleteNote = (data) => {
    // callback for removing a note from the state
    
    // remove the note by its index
    let allTodos = this.state.todos;
    allTodos.splice(data, 1);
    this.setState({todos: allTodos});
  }

  completedNote = (data) => {
    // callback for completing a todo
    
    // toggle complete status in the note by its index
    let allTodos = this.state.todos;
    if(allTodos[data].completed === true) {
      allTodos[data].completed = false;
    } else {
      allTodos[data].completed = true;
    }
    
    this.setState({todos: allTodos});
  }

  render() {
    return (
      <div className="homeContainer">
        <NewTodo 
          createNewNote={this.createNewNote} 
        />
        <AllTodos 
          allTodos={this.state.todos}
          deleteNote={this.deleteNote}
          completedNote={this.completedNote}
        />
      </div>
    )
  }
};

export default Home;