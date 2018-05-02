import React, { Component } from 'react';
import shortid from 'shortid';
import moment from 'moment';

import NewList from './NewList';
import Lists from './Lists';
import TodoFilters from './TodoFilters';

import './Home.css';

import firebase from '../firebase.js';

import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filteringCompleted: false,
      searchQuery: '',
      lists: [],
      isLoadingLists: false,
    };
  }

  componentDidMount() {
    // get reference to firebase db
    const todosDB = firebase.database().ref('todos');
    // setup firebase event watcher
    // fires anytime a change is detected in todosDB
    todosDB.on('value', (snapshot) => {
      this.setState({isLoadingLists: true});
      let lists = snapshot.val();
      let allLists = [];
      if(lists) {
        console.log(lists)
        Object.keys(lists).forEach(function(obj) {
          // push each todo from the db to array
          allLists.push(lists[obj])
        });
        this.setState({ lists: allLists })
      }
    });
  }

  createNewList = (data) => {
    let createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    let newList = {
      editable: false,
      listTitle: data,
      key: shortid.generate(),
      visible: true,
      created: createdAt,
      notes: ['empty'],
    }

    // this is a prop callback for adding new notes to the state
    let tempLists = this.state.lists;
    tempLists.push(newList);
    this.setState({lists: tempLists});

    // get reference to firebase db
    const db = firebase.database().ref('todos');
     
    db.push(newList)
      .then(res => {
        let key = res.getKey();
        firebase.database().ref().child('/todos/' + key)
          .update({ dbListKey: key});
      })
  }

  createNewNote = (data) => {
    let createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    let newNote = {
      completed: false,
      editable: false,
      todoText: data.note,
      key: shortid.generate(),
      visible: true,
      created: createdAt,
      dbListKey: data.thisListKey,
    }

    let allLists = this.state.lists;
    allLists.forEach(function(list) {
      if(list.dbListKey === newNote.dbListKey) {
        list.notes.push(newNote)
        const db = firebase.database().ref('/todos/' + list.dbListKey);
        db.set(list)
      }
    })
  }

  deleteNote = (data) => {
    // remove a note from the db
    // do this by finding the correct list and getting its notes
    // then splicing out the selected note
    // and update the db notes

    // finds correct list based on dbListKey
    let list = this.state.lists.find(function (item) { 
      return item.dbListKey === data.listKey; 
    });

    // find which note to remove
    list.notes.forEach(function(item, index) {
      if(item.key === data.noteKey) {
        list.notes.splice(index, 1)
      }
    })

    // update
    const db = firebase.database().ref(`/todos/` + data.listKey);
    db.update({ notes: list.notes});
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

  updateListOrder = (data) => {
    // when a list changed locally send that upate to the server
    // data is new list order
    const db = firebase.database().ref('todos');
    db.set(data)
  }

  render() {
    return (
      <div className="homeContainer">
        <NewList 
          createNewList={this.createNewList} 
        />
        <TodoFilters 
          filteringCompleted={this.state.filteringCompleted}
          toggleFilteringComplete={this.toggleFilteringComplete}
          updateSearchQuery={this.updateSearchQuery}
        />
        <Lists 
          allLists={this.state.lists}
          deleteNote={this.deleteNote}
          completedNote={this.completedNote}
          setEditMode={this.setEditMode}
          saveEdit={this.saveEdit}
          filteringCompleted={this.state.filteringCompleted}
          searchQuery={this.state.searchQuery}
          createNewNote={this.createNewNote}
          updateListOrder={this.updateListOrder}
          isLoadingLists={this.state.isLoadingLists}
        />
        {/*}
        <ResponsiveGridLayout className="layout" cols={12} rowHeight={30} width={500}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        <div key="a" className="gridBox" >a</div>
        <div key="b" className="gridBox" data-grid={{x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4}}>b</div>
        <div key="c" className="gridBox" data-grid={{x: 4, y: 0, w: 1, h: 2}}>c</div>
      </ResponsiveGridLayout>
      {*/}
      </div>
    )
  }
};

export default Home;