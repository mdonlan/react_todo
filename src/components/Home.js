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
          visible: true,
        },
        {
          completed: false,
          editable: false,
          todoText: 'test2',
          key: shortid.generate(),
          visible: true,
        },
        {
          completed: false,
          editable: false,
          todoText: 'test3',
          key: shortid.generate(),
          visible: true,
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
      visible: true,
    }
    // this is a prop callback for adding new notes to the state
    let allTodos = this.state.todos;
    allTodos.push(newNote);
    this.setState({todos: allTodos});
  }

  deleteNote = (key) => {
    // callback for removing a note from the state

    // get specific item in todos array based off item key
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === key; 
    });
    
    //remove the note
    let allTodos = this.state.todos;
    allTodos.splice(todo.index, 1);
    this.setState({todos: allTodos});
  }

  completedNote = (key) => {
    // callback for completing a todo
    
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === key; 
    });
    // toggle complete status in the note by its index
    let allTodos = this.state.todos;
    if(allTodos[todo.index].completed === true) {
      allTodos[todo.index].completed = false;
    } else {
      allTodos[todo.index].completed = true;
    }
    if(allTodos[todo.index].editable === true) {
      allTodos[todo.index].editable = false;
    }
    
    this.setState({todos: allTodos});
  }

  setEditMode = (key) => {
    // callback for completing a todo
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === key; 
    });
    // toggle complete status in the note by its index
    let allTodos = this.state.todos;
    if(allTodos[todo.index].editable === true) {
      allTodos[todo.index].editable = false;
    } else {
      // if not already editable and not completed
      if(allTodos[todo.index].completed === false) {
        allTodos[todo.index].editable = true;
      }
    }
    
    this.setState({todos: allTodos});
  }

  saveEdit = (data) => {
    // update state w/ new note text and turn off editing
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === data[1]; 
    });
    
    let allTodos = this.state.todos;
    allTodos[todo.index].todoText = data[0];
    allTodos[todo.index].editable = false;
    this.setState({todos: allTodos});   
  }

  toggleFilteringComplete = (data) => {
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