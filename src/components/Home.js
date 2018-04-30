import React, { Component } from 'react';
import shortid from 'shortid';
import moment from 'moment';

import NewTodo from './NewTodo';
import AllTodos from './AllTodos';
import TodoFilters from './TodoFilters';

import firebase from '../firebase.js';
import './home.css';

class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filteringCompleted: false,
      searchQuery: '',
    };
  }

  componentDidMount() {
    // get reference to firebase db
    const todosDB = firebase.database().ref('todos');
    // setup firebase event watcher
    // fires anytime a change is detected in todosDB
    todosDB.on('value', (snapshot) => {
      let todos = snapshot.val();
      let allTodos = [];
      if(todos) {
        Object.keys(todos).forEach(function(obj) {
          // push each todo from the db to array
          allTodos.push(todos[obj])
        });
        this.setState({ todos: allTodos })
      }
    });
  }

  createNewNote = (data) => {
    let createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    let newNote = {
      completed: false,
      editable: false,
      todoText: data,
      key: shortid.generate(),
      visible: true,
      created: createdAt,
    }
    // this is a prop callback for adding new notes to the state
    let allTodos = this.state.todos;
    allTodos.push(newNote);
    this.setState({todos: allTodos});

    // get reference to firebase db
    const todosDB = firebase.database().ref('todos');
    
    // push new todo to firebase db
    // on callback from db get key and then 
    // push the todo to the server again w/ key 
    todosDB.push(newNote)
      .then(res => {
        let key = res.getKey();
        firebase.database().ref().child('/todos/' + key)
          .update({ dbKey: key});
      })

    
  }

  deleteNote = (key) => {
    // callback for removing a note from the state

    // get specific item in todos array based off item key
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === key; 
    });

    const todoRef = firebase.database().ref(`/todos/` + todo.dbKey);
    todoRef.remove();
  }

  completedNote = (key) => {
    // callback for completing a todo
    
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === key; 
    });
   
    // toggle completed
    let isCompleted;
    if(todo.completed === true) {
      isCompleted = false;
    } else {
      isCompleted = true;
    }

    // set updated completed state to db
    let dbKey = todo.dbKey;
    firebase.database().ref().child('/todos/' + dbKey)
      .update({ completed: isCompleted});
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

    let key = todo.dbKey;
    firebase.database().ref().child('/todos/' + key)
      .update({ todoText: data[0], editable: false});
    
 
  }

  toggleFilteringComplete = () => {
    if(this.state.filteringCompleted === true) {
      this.setState({filteringCompleted: false});   
    } else {
      this.setState({filteringCompleted: true});   
    }
  }

  updateSearchQuery = (data) => {
    this.setState({searchQuery: data});
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
          updateSearchQuery={this.updateSearchQuery}
        />
        <AllTodos 
          allTodos={this.state.todos}
          deleteNote={this.deleteNote}
          completedNote={this.completedNote}
          setEditMode={this.setEditMode}
          saveEdit={this.saveEdit}
          filteringCompleted={this.state.filteringCompleted}
          searchQuery={this.state.searchQuery}
        />
      </div>
    )
  }
};

export default Home;