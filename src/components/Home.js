import React, { Component } from 'react';
import shortid from 'shortid';

import NewTodo from './NewTodo';
import AllTodos from './AllTodos';
import TodoFilters from './TodoFilters';

import './home.css';

class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        {
          completed: false,
          editable: false,
          todoText: 'test1',
          key: shortid.generate(),
        },
        {
          completed: false,
          editable: false,
          todoText: 'test2',
          key: shortid.generate(),
        },
        {
          completed: false,
          editable: false,
          todoText: 'test3',
          key: shortid.generate(),
        },
      ],
      filteringCompleted: false,
    };
  }

  createNewNote = (data) => {
    let newNote = {
      completed: false,
      editable: false,
      todoText: data,
      key: shortid.generate(),
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
    if(allTodos[data].editable === true) {
      allTodos[data].editable = false;
    }
    
    this.setState({todos: allTodos});
  }

  setEditMode = (data) => {
    // callback for completing a todo
    
    // toggle complete status in the note by its index
    let allTodos = this.state.todos;
    if(allTodos[data].editable === true) {
      allTodos[data].editable = false;
    } else {
      // if not already editable and not completed
      if(allTodos[data].completed === false) {
        allTodos[data].editable = true;
      }
    }
    
    this.setState({todos: allTodos});
  }

  saveEdit = (data) => {
    // update state w/ new note text and turn off editing
    let allTodos = this.state.todos;
    allTodos[data[1]].todoText = data[0];
    allTodos[data[1]].editable = false;
    this.setState({todos: allTodos});   
  }

  toggleFilteringComplete = (data) => {
    console.log(this.state)
    if(this.state.filteringCompleted === true) {
      this.setState({filteringCompleted: false});   
    } else {
      this.setState({filteringCompleted: true});   
    }
  }

  render() {
    return (
      <div className="homeContainer">
        <NewTodo 
          createNewNote={this.createNewNote} 
        />
        <TodoFilters 
          filteringCompleted={this.state.filteringCompleted}
          toggleFilteringComplete={this.toggleFilteringComplete}
        />
        <AllTodos 
          allTodos={this.state.todos}
          deleteNote={this.deleteNote}
          completedNote={this.completedNote}
          setEditMode={this.setEditMode}
          saveEdit={this.saveEdit}
          filteringCompleted={this.state.filteringCompleted}
        />
      </div>
    )
  }
};

export default Home;